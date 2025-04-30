import $ from 'cash-dom';

export const addDonwloadAudio = () => {
  const astMessages = document.querySelectorAll("div[data-message-author-role='assistant']");
  astMessages.forEach(a => {
    const messageId = a.dataset.messageId;
    const parent = a.parentElement;
    if (parent) {
      const actionContainer = parent.nextElementSibling;
      const downloadAction = actionContainer?.querySelector('.supergpt-download-audio');
      if (downloadAction === null) {
        const container = actionContainer?.children[0];
        const downloadSvg = `<svg width="17px" height="17px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--mantine-message-action-button)" stroke-width="0.696"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="var(--mantine-message-action-button)"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="var(--mantine-message-action-button)"></path> </g></svg>`;
        const downloadButton = document.createElement('span');
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.margin = '0.2rem';
        downloadButton.classList.add('supergpt-download-audio');
        downloadButton.classList.add('supergpt-message-action');
        downloadButton.innerHTML = `${downloadSvg}`;
        downloadButton.onclick = async () => {
          await chrome.storage.local.set({ audioMId: messageId });
          $('#supergpt-download-audio-modal').trigger('click');
        };
        container?.insertBefore(downloadButton, container.children[2]?.nextElementSibling);
      }
    }
  });
};

export const addNavigateUp = () => {
  const astMessages = document.querySelectorAll("div[data-message-author-role='assistant']");
  astMessages.forEach(a => {
    const parent = a.parentElement;
    if (parent) {
      const actionContainer = parent.nextElementSibling;
      const navigateUpAction = actionContainer?.querySelector('.supergpt-navigate-up');
      if (navigateUpAction === null) {
        const container = actionContainer?.children[0];
        const upSVG = `<svg fill="var(--mantine-message-action-button)" width="17px" height="17px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.293,1.293a1,1,0,0,1,1.414,0l5,5a1,1,0,0,1-1.414,1.414L13,4.414V22a1,1,0,0,1-2,0V4.414L7.707,7.707A1,1,0,0,1,6.293,6.293Z"></path></g></svg>`;
        const navigateUpBtn = document.createElement('span');
        navigateUpBtn.style.cursor = 'pointer';
        navigateUpBtn.style.margin = '0.2rem';
        navigateUpBtn.classList.add('supergpt-navigate-up');
        navigateUpBtn.classList.add('supergpt-message-action');
        navigateUpBtn.innerHTML = `${upSVG}`;
        navigateUpBtn.onclick = () => {
          a.scrollIntoView();
        };
        container?.insertBefore(navigateUpBtn, container.children[2]?.nextElementSibling);
      }
    }
  });
};
