import { extractChatId } from './chatUtils';

export const pinConversations = () => {
  const sidebar = document.querySelector('div.group\\/sidebar');
  const allConvos = sidebar?.querySelectorAll('li[data-testid]');
  const pinnedConversations = sidebar?.querySelector('.supergpt-all-pinned-conversations');
  const pinSVG = `<svg width="14px" height="14px" viewBox="0 0 24.00 24.00" style="margin:0px 5px;" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1218 1.87023C15.7573 0.505682 13.4779 0.76575 12.4558 2.40261L9.61062 6.95916C9.61033 6.95965 9.60913 6.96167 9.6038 6.96549C9.59728 6.97016 9.58336 6.97822 9.56001 6.9848C9.50899 6.99916 9.44234 6.99805 9.38281 6.97599C8.41173 6.61599 6.74483 6.22052 5.01389 6.87251C4.08132 7.22378 3.61596 8.03222 3.56525 8.85243C3.51687 9.63502 3.83293 10.4395 4.41425 11.0208L7.94975 14.5563L1.26973 21.2363C0.879206 21.6269 0.879206 22.26 1.26973 22.6506C1.66025 23.0411 2.29342 23.0411 2.68394 22.6506L9.36397 15.9705L12.8995 19.5061C13.4808 20.0874 14.2853 20.4035 15.0679 20.3551C15.8881 20.3044 16.6966 19.839 17.0478 18.9065C17.6998 17.1755 17.3043 15.5086 16.9444 14.5375C16.9223 14.478 16.9212 14.4114 16.9355 14.3603C16.9421 14.337 16.9502 14.3231 16.9549 14.3165C16.9587 14.3112 16.9606 14.31 16.9611 14.3098L21.5177 11.4645C23.1546 10.4424 23.4147 8.16307 22.0501 6.79853L17.1218 1.87023ZM14.1523 3.46191C14.493 2.91629 15.2528 2.8296 15.7076 3.28445L20.6359 8.21274C21.0907 8.66759 21.0041 9.42737 20.4584 9.76806L15.9019 12.6133C14.9572 13.2032 14.7469 14.3637 15.0691 15.2327C15.3549 16.0037 15.5829 17.1217 15.1762 18.2015C15.1484 18.2752 15.1175 18.3018 15.0985 18.3149C15.0743 18.3316 15.0266 18.3538 14.9445 18.3589C14.767 18.3699 14.5135 18.2916 14.3137 18.0919L5.82846 9.6066C5.62872 9.40686 5.55046 9.15333 5.56144 8.97583C5.56651 8.8937 5.58877 8.84605 5.60548 8.82181C5.61855 8.80285 5.64516 8.7719 5.71886 8.74414C6.79869 8.33741 7.91661 8.56545 8.68762 8.85128C9.55668 9.17345 10.7171 8.96318 11.3071 8.01845L14.1523 3.46191Z" fill="var(--mantine-message-action-button)"></path> </g></svg>`;
  const openLink = `<svg width="14px" height="14px" viewBox="0 0 24 24" style="margin:0px 5px;" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / External_Link"> <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="var(--mantine-message-action-button)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`;
  const exportSVG = `<svg width="14px" height="14px" viewBox="0 0 24 24" style="margin:0px 5px;" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5L11.2929 4.29289L12 3.58579L12.7071 4.29289L12 5ZM13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14L13 14ZM6.29289 9.29289L11.2929 4.29289L12.7071 5.70711L7.70711 10.7071L6.29289 9.29289ZM12.7071 4.29289L17.7071 9.29289L16.2929 10.7071L11.2929 5.70711L12.7071 4.29289ZM13 5L13 14L11 14L11 5L13 5Z" fill="var(--mantine-message-action-button)"></path> <path d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16" stroke="var(--mantine-message-action-button)" stroke-width="2"></path> </g></svg>`;
  allConvos?.forEach(convo => {
    if (convo.querySelector('.supergpt-pinchat') === null) {
      const actionContainer = document.createElement('span');
      actionContainer.classList = 'supergpt-pinchat supergpt-hidden';
      const pinBtn = document.createElement('span');
      pinBtn.style = 'display:inline-flex;align-items:center;cursor:pointer;';
      pinBtn.className = 'supergpt-pin-button';
      pinBtn.innerHTML = `${pinSVG} Pin`;
      const openBtn = document.createElement('span');
      openBtn.style = 'display:inline-flex;align-items:center;cursor:pointer;';
      openBtn.className = 'supergpt-open-chat';
      openBtn.innerHTML = `${openLink} Open`;
      const exportChat = document.createElement('span');
      exportChat.style = 'display:inline-flex;align-items:center;cursor:pointer;';
      exportChat.className = 'supergpt-export-chat';
      exportChat.innerHTML = `${exportSVG} Export`;
      actionContainer.appendChild(pinBtn);
      // actionContainer.appendChild(openBtn);
      actionContainer.appendChild(exportChat);
      const parent = convo.children[0] as HTMLElement;
      parent.prepend(actionContainer);
      const link = parent.childNodes[1] as HTMLAnchorElement;
      parent.style.display = 'flex';
      parent.onmouseenter = e => {
        if (e.altKey) {
          link.classList.add('supergpt-hidden');
          actionContainer.classList.remove('supergpt-hidden');
          actionContainer.classList.add('supergpt-show');
        }
      };

      parent.onmouseleave = () => {
        link.classList.remove('supergpt-hidden');
        actionContainer.classList.add('supergpt-hidden');
        actionContainer.classList.remove('supergpt-show');
      };

      exportChat.onclick = () => {
        const btn = document.querySelector('#supergpt-export-chat-mdoal') as HTMLElement;
        const convoId = extractChatId(link.href);
        if (convoId) {
          window.dispatchEvent(new CustomEvent('export-chat', { detail: { convoId: convoId } }));
          btn.click();
        }
      };
      pinBtn.onclick = () => {
        const pinnedChats = JSON.parse(localStorage.getItem('pinnedConversations') ?? '{}');
        const convoId = extractChatId(link.href);
        if (convoId) {
          const title = link.innerText;
          pinnedChats[convoId] = title;
          localStorage.setItem('pinnedConversations', JSON.stringify(pinnedChats));
          pinnedConversations?.dispatchEvent(
            new CustomEvent('updatePinnedConversations', { bubbles: false, cancelable: false }),
          );
        }
      };
      openBtn.onclick = () => {
        link.click();
      };
    }
  });
};

export const addPinnedConversationSection = () => {
  const superGPTContainer = document.querySelector('.supergpt-sidebar-container');
  const expandSVG = `<svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="var(--mantine-message-action-button)"></path> </g></svg>`;
  const collapseSVG = `<svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, -1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="var(--mantine-message-action-button)"></path> </g></svg>`;
  const updateChats = (c: HTMLDivElement) => {
    const unpinSVG = `<svg width="14px" height="14px" style="margin:0px 5px;" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(45)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1218 1.87023C15.7573 0.505682 13.4779 0.76575 12.4558 2.40261L9.61062 6.95916C9.61033 6.95965 9.60913 6.96167 9.6038 6.96549C9.59728 6.97016 9.58336 6.97822 9.56001 6.9848C9.50899 6.99916 9.44234 6.99805 9.38281 6.97599C8.41173 6.61599 6.74483 6.22052 5.01389 6.87251C4.08132 7.22378 3.61596 8.03222 3.56525 8.85243C3.51687 9.63502 3.83293 10.4395 4.41425 11.0208L7.94975 14.5563L1.26973 21.2363C0.879206 21.6269 0.879206 22.26 1.26973 22.6506C1.66025 23.0411 2.29342 23.0411 2.68394 22.6506L9.36397 15.9705L12.8995 19.5061C13.4808 20.0874 14.2853 20.4035 15.0679 20.3551C15.8881 20.3044 16.6966 19.839 17.0478 18.9065C17.6998 17.1755 17.3043 15.5086 16.9444 14.5375C16.9223 14.478 16.9212 14.4114 16.9355 14.3603C16.9421 14.337 16.9502 14.3231 16.9549 14.3165C16.9587 14.3112 16.9606 14.31 16.9611 14.3098L21.5177 11.4645C23.1546 10.4424 23.4147 8.16307 22.0501 6.79853L17.1218 1.87023ZM14.1523 3.46191C14.493 2.91629 15.2528 2.8296 15.7076 3.28445L20.6359 8.21274C21.0907 8.66759 21.0041 9.42737 20.4584 9.76806L15.9019 12.6133C14.9572 13.2032 14.7469 14.3637 15.0691 15.2327C15.3549 16.0037 15.5829 17.1217 15.1762 18.2015C15.1484 18.2752 15.1175 18.3018 15.0985 18.3149C15.0743 18.3316 15.0266 18.3538 14.9445 18.3589C14.767 18.3699 14.5135 18.2916 14.3137 18.0919L5.82846 9.6066C5.62872 9.40686 5.55046 9.15333 5.56144 8.97583C5.56651 8.8937 5.58877 8.84605 5.60548 8.82181C5.61855 8.80285 5.64516 8.7719 5.71886 8.74414C6.79869 8.33741 7.91661 8.56545 8.68762 8.85128C9.55668 9.17345 10.7171 8.96318 11.3071 8.01845L14.1523 3.46191Z" fill="var(--mantine-message-action-button)"></path> </g></svg>`;
    const openLink = `<svg width="14px" height="14px" viewBox="0 0 24 24" style="margin:0px 5px;" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / External_Link"> <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="var(--mantine-message-action-button)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`;
    const pinnedChats = JSON.parse(localStorage.getItem('pinnedConversations') ?? '{}');
    Object.keys(pinnedChats).forEach(convoId => {
      const span = document.createElement('span');
      const link = document.createElement('a');
      link.innerText = pinnedChats[convoId];
      link.href = `/c/${convoId}`;
      span.appendChild(link);
      span.style = 'padding: 5px;';
      c.appendChild(span);
      const actionContainer = document.createElement('span');
      actionContainer.classList = 'supergpt-action-container supergpt-hidden';
      const unpinBtn = document.createElement('span');
      unpinBtn.style = 'display:inline-flex;align-items:center;cursor:pointer;';
      unpinBtn.className = 'supergpt-pin-button';
      unpinBtn.innerHTML = `${unpinSVG}  Unpin`;
      const openBtn = document.createElement('span');
      openBtn.style = 'display:inline-flex;align-items:center;cursor:pointer;';
      openBtn.className = 'supergpt-open-chat';
      openBtn.innerHTML = `${openLink} Open Chat`;
      actionContainer.prepend(openBtn);
      actionContainer.prepend(unpinBtn);
      span.prepend(actionContainer);
      span.onmouseenter = e => {
        if (e.altKey) {
          link.classList.add('supergpt-hidden');
          actionContainer.classList.remove('supergpt-hidden');
          actionContainer.classList.add('supergpt-show');
        }
      };

      span.onmouseleave = () => {
        link.classList.remove('supergpt-hidden');
        actionContainer.classList.add('supergpt-hidden');
        actionContainer.classList.remove('supergpt-show');
      };

      unpinBtn.onclick = () => {
        const convoId = extractChatId(link.href);
        if (convoId) {
          delete pinnedChats[convoId];
          localStorage.setItem('pinnedConversations', JSON.stringify(pinnedChats));
          c.innerHTML = '';
          updateChats(c);
        }
      };
      openBtn.onclick = () => {
        link.click();
      };
    });
  };
  if (superGPTContainer?.querySelector('.supergpt-all-pinned-conversations') === null) {
    const div = document.createElement('div');
    div.className = 'supergpt-all-pinned-conversations';
    const title = document.createElement('span');
    title.className = 'title';
    const titleContainer = document.createElement('span');
    titleContainer.innerText = 'Pinned Conversations';
    titleContainer.style.flex = '3';
    title.appendChild(titleContainer);
    const expCollBtn = document.createElement('span');
    expCollBtn.innerHTML = collapseSVG;
    expCollBtn.classList = 'collapse-btn';
    expCollBtn.style.cursor = 'pointer';
    expCollBtn.style.flex = '1';
    expCollBtn.style.alignContent = 'center';
    expCollBtn.style.justifyItems = 'end';
    title.appendChild(expCollBtn);
    div.appendChild(title);
    const chatContainer = document.createElement('div');
    chatContainer.className = 'pinned-chats';
    div.appendChild(chatContainer);
    div.style = 'display:flex;flex-direction:column;';
    superGPTContainer.insertBefore(div, superGPTContainer.children[4]);
    updateChats(chatContainer);
    expCollBtn.onclick = () => {
      if (expCollBtn.classList.contains('collapse-btn')) {
        expCollBtn.classList.remove('collapse-btn');
        expCollBtn.classList.add('expand-btn');
        expCollBtn.innerHTML = expandSVG;
        chatContainer.classList.add('supergpt-hidden');
      } else {
        expCollBtn.classList.remove('expand-btn');
        expCollBtn.classList.add('collapse-btn');
        expCollBtn.innerHTML = collapseSVG;
        chatContainer.classList.remove('supergpt-hidden');
      }
    };
    div.addEventListener('updatePinnedConversations', () => {
      chatContainer.innerHTML = '';
      updateChats(chatContainer);
    });
  }
};
