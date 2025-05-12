import $ from 'cash-dom';
import './index.css';
import { fetchAllConversations } from './fetchData';
import { addDonwloadAudio, addNavigateUp } from './messageOptions';
import { addPinnedConversationSection, pinConversations } from './pinConversations';
import { addContainer } from './addContainer';
import { extractChatId, getTheme, SyncStatus, updateStatus } from './chatUtils';
import { addOrganizeChats } from './addOrganizeChats';
import { addCustomListeners } from './customEventListeners';

const addMessageActionBar = () => {
  const agentAnswers = document.querySelectorAll<HTMLDivElement>('.group\\/conversation-turn.agent-turn');
  const pinnedChats = JSON.parse(localStorage.getItem('pinnedChats') ?? '{}');

  agentAnswers.forEach(aA => {
    if (aA.querySelector('.supergpt-action-container') === null) {
      const currentConvoId = extractChatId(window.location.href);
      if (!pinnedChats[currentConvoId]) {
        pinnedChats[currentConvoId] = [];
      }
      const chatActionContainer = document.createElement('div');
      chatActionContainer.style.display = 'flex';
      chatActionContainer.style.flexDirection = 'row';
      chatActionContainer.className = 'supergpt-action-container';
      const assistantAnswer = aA.children[0] as HTMLDivElement;
      const answer = aA.querySelector("div[data-message-author-role='assistant']")!;
      const mId = answer.getAttribute('data-message-id')!;
      const chatAlreadyPinned = pinnedChats[currentConvoId]
        ? pinnedChats[currentConvoId].some(({ messageId }) => messageId === mId)
        : false;
      const pinChatButton = document.createElement('button');
      pinChatButton.classList = 'pin-chat';
      pinChatButton.textContent = chatAlreadyPinned ? 'Unpin' : '📌 Pin';
      pinChatButton.style.margin = '0.5rem 0.5rem';
      pinChatButton.style.textAlign = 'left';
      pinChatButton.style.color = 'grey';
      pinChatButton.style.border = '#3e3e3e 2px solid';
      pinChatButton.style.fontSize = '14px';
      pinChatButton.style.borderRadius = '20px';
      pinChatButton.style.padding = '0.2rem 0.5rem';
      pinChatButton.onclick = () => {
        const pinnedChats = JSON.parse(localStorage.getItem('pinnedChats') ?? '{}');
        const answer = aA.querySelector("div[data-message-author-role='assistant']")!;
        const mId = answer.getAttribute('data-message-id')!;
        const chatAlreadyPinned = pinnedChats[currentConvoId]
          ? pinnedChats[currentConvoId].some(({ messageId }) => messageId === mId)
          : false;
        if (chatAlreadyPinned) {
          pinnedChats[currentConvoId] = pinnedChats[currentConvoId].filter(
            ({ messageId }: { messageId: string }) => messageId !== mId,
          );
          pinChatButton.textContent = '📌 Pin';
        } else {
          if (pinnedChats[currentConvoId]) {
            pinnedChats[currentConvoId].push({ messageId: mId, text: answer?.textContent?.slice(0, 50) });
            pinChatButton.textContent = 'Unpin';
          } else {
            pinnedChats[currentConvoId] = [{ messageId: mId, text: answer?.textContent?.slice(0, 50) }];
            pinChatButton.textContent = 'Unpin';
          }
        }
        localStorage.setItem('pinnedChats', JSON.stringify(pinnedChats));
        $('#update-pins').trigger('click');
      };

      const collapseButton = document.createElement('button');
      collapseButton.classList = 'collapse-chat expanded';
      collapseButton.textContent = '- Collapse';
      collapseButton.style.margin = '0.5rem 0.5rem';
      collapseButton.style.textAlign = 'left';
      collapseButton.style.color = 'grey';
      collapseButton.style.border = '#3e3e3e 2px solid';
      collapseButton.style.fontSize = '14px';
      collapseButton.style.borderRadius = '20px';
      collapseButton.style.padding = '0.2rem 0.5rem';
      chatActionContainer.appendChild(collapseButton);
      chatActionContainer.appendChild(pinChatButton);
      collapseButton.onclick = () => {
        if (collapseButton.classList.contains('collapsed')) {
          assistantAnswer.style.display = 'block';
          collapseButton.classList.remove('collapsed');
          collapseButton.classList.add('expanded');
          collapseButton.textContent = '- Collapse';
        } else {
          assistantAnswer.style.display = 'none';
          collapseButton.textContent = '+ Expand';
          collapseButton.classList.add('collapsed');
          collapseButton.classList.remove('expanded');
        }
      };
      aA.prepend(chatActionContainer);
    }
  });
};

const addManageTags = () => {
  const superGPTContainer = document.querySelector('.supergpt-sidebar-container');
  const currentTheme = getTheme();

  const gearSVG = `<svg width="20px" height="20px" style="margin-right:10px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="${currentTheme === 'light' ? 'black' : 'white'}" stroke-width="1.5"></path> </g></svg>`;
  if (superGPTContainer?.querySelector('.manage-tags') === null) {
    const containerDiv = $(
      `<div class="manage-tags" style="color:${currentTheme === 'light' ? 'black' : 'white'};cursor:pointer;margin-top:15px;margin-left:10px;font-size:14px;display:flex;flex-direction:row">${gearSVG} Manage Chats</div>`,
    );
    containerDiv.on('click', () => {
      $('#open-category-chat').trigger('click');
    });
    $('.supergpt-sidebar-container').append(containerDiv);
  }
};

const addSearch = () => {
  const superGPTContainer = document.querySelector('.supergpt-sidebar-container');
  const currentTheme = getTheme();
  const searchSVG = `<svg width="20px" height="20px" style="margin-right:10px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="${currentTheme === 'light' ? 'black' : 'white'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
  if (superGPTContainer?.querySelector('#supergpt-search') === null) {
    const containerDiv = $(
      `<div id="supergpt-search" style="color:${currentTheme === 'light' ? 'black' : 'white'};cursor:pointer;margin-top:15px;margin-left:10px;font-size:15px;display:flex;flex-direction:column;"><div style="display:flex;flex-direction:row;cursor:pointer;">${searchSVG} Search Chats</div><div><span id="supergpt-search-sync" class="supergpt-show">🔄 Syncing</span><span id="supergpt-search-synced" class="supergpt-hide">✅ Synced</span><span id="supergpt-sync-error" class="supergpt-hide" style="font-size:12px;">❌ Error. Please refresh to retry.</span></div></div>`,
    );
    containerDiv.on('click', () => {
      $('#supergpt-search-modal').trigger('click');
    });
    $('.supergpt-sidebar-container').append(containerDiv);
  }
};

const addMediaGallery = () => {
  const superGPTContainer = document.querySelector('.supergpt-sidebar-container');
  const currentTheme = getTheme();
  const mediaSVG = `<svg fill="${currentTheme === 'light' ? 'black' : 'white'}" width="20px" height="20px" style="margin-right:10px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>image</title> <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM6.016 24q0 0.832 0.576 1.44t1.408 0.576h16q0.832 0 1.408-0.576t0.608-1.44v-0.928q-0.224-0.448-1.12-2.688t-1.6-3.584-1.28-2.112q-0.544-0.576-1.12-0.608t-1.152 0.384-1.152 1.12-1.184 1.568-1.152 1.696-1.152 1.6-1.088 1.184-1.088 0.448q-0.576 0-1.664-1.44-0.16-0.192-0.48-0.608-1.12-1.504-1.6-1.824-0.768-0.512-1.184 0.352-0.224 0.512-0.928 2.24t-1.056 2.56v0.64zM6.016 9.024q0 1.248 0.864 2.112t2.112 0.864 2.144-0.864 0.864-2.112-0.864-2.144-2.144-0.864-2.112 0.864-0.864 2.144z"></path> </g></svg>`;
  if (superGPTContainer?.querySelector('#supergpt-media-gallery') === null) {
    const containerDiv = $(
      `<div id="supergpt-media-gallery" style="color:${currentTheme === 'light' ? 'black' : 'white'};cursor:pointer;margin-top:15px;margin-left:10px;font-size:15px;display:flex;flex-direction:column;"><div style="display:flex;flex-direction:row;cursor:pointer;">${mediaSVG} Media Gallery</div></div>`,
    );
    containerDiv.on('click', () => {
      $('#supergpt-media-gallery-modal').trigger('click');
    });
    $('.supergpt-sidebar-container').append(containerDiv);
  }
};

let prevURL = window.location.href;

setInterval(() => {
  const currentURL = window.location.href;
  if (currentURL !== prevURL) {
    setTimeout(updateStatus, 2000);
    $('#update-pins').trigger('click');
    window.dispatchEvent(new CustomEvent('update-annotations', { bubbles: false, cancelable: false }));
    prevURL = currentURL;
  }
}, 500);

setInterval(() => {
  addContainer();
  addMessageActionBar();
  addManageTags();
  addOrganizeChats();
  addSearch();
  addMediaGallery();
  addDonwloadAudio();
  addNavigateUp();
  addPinnedConversationSection();
  pinConversations();
}, 500);

const populateDB = async () => {
  const authToken = await chrome.storage.local.get('authToken');
  if (authToken) {
    await fetchAllConversations();
    updateStatus(SyncStatus.SYNCED);
  } else {
    const id = setInterval(async () => {
      const token = await chrome.storage.local.get('authToken');
      if (token) {
        await fetchAllConversations();
        clearInterval(id);
        updateStatus(SyncStatus.SYNCED);
      }
    }, 500);
  }
};

setInterval(() => {
  const pattern = /^https:\/\/chatgpt\.com\/c\/([^/?]+)\?mid=([^&]+)/;
  const currentURL = window.location.href;
  const highlightDetails = JSON.parse(localStorage.getItem('highlightDetails') ?? 'null');
  if (pattern.test(currentURL) && highlightDetails != null) {
    const el = document.querySelector(`div[data-message-id="${highlightDetails.msgId}"]`);
    if (el) {
      wrapWordInTextNodes(el, highlightDetails.word);
      localStorage.removeItem('highlightDetails');
      const selected = document.querySelectorAll('span.supergpt-highlight-word');
      selected[0].scrollIntoView();
      setTimeout(() => {
        selected.forEach(s => s.classList.remove('supergpt-highlight-word'));
      }, 5000);
    }
  }
}, 500);

function wrapWordInTextNodes(rootEl, targetWord) {
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);

  const regex = new RegExp(`(${targetWord})`, 'gi');

  let node;
  while ((node = walker.nextNode())) {
    const { textContent } = node;
    if (!regex.test(textContent)) continue;

    const spanContainer = document.createElement('span');

    spanContainer.innerHTML = textContent.replace(regex, '<span class="supergpt-highlight-word">$1</span>');

    node.replaceWith(...spanContainer.childNodes);
  }
}

setTimeout(() => {
  populateDB();
}, 5000);

setTimeout(() => {
  window.addEventListener('keydown', openQuestionsModal);
}, 3000);

const openQuestionsModal = e => {
  if (e.altKey && e.key === 'Tab') {
    e.preventDefault();
    $('#supergpt-questions-list').trigger('click');
  }
};

const addFolderIdStart = async () => {
  const folderData = await chrome.storage.local.get('folderData');
  if (folderData && Object.keys(folderData).length === 0) {
    await chrome.storage.local.set({ folderData: JSON.stringify({ startIdx: 100 }) });
  }
};

const loadUserDetails = async () => {
  const { authToken } = await chrome.storage.local.get('authToken');
  try {
    const res = await fetch('https://chatgpt.com/backend-api/me', {
      headers: {
        Authorization: authToken,
      },
    });
    const data = await res.json();
    const { email } = data;
    await chrome.storage.local.set({ userEmail: email });
  } catch {
    console.log('Could not fetch user details');
  }
};

addFolderIdStart();

setTimeout(loadUserDetails, 10000);

document.addEventListener('click', e => {
  if (e.altKey) {
    e.preventDefault();
  }
});

addCustomListeners();
