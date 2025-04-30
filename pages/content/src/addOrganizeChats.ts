import $ from 'cash-dom';
import { getTheme } from './chatUtils';

export const addOrganizeChats = () => {
  const superGPTContainer = document.querySelector('.supergpt-sidebar-container');
  const currentTheme = getTheme();
  const folderSVG = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" style="margin-right:10px" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 3H8C8.69805 3.00421 9.38286 3.19101 9.98634 3.54187C10.5898 3.89273 11.091 4.39545 11.44 5C11.797 5.60635 12.3055 6.10947 12.9156 6.46008C13.5256 6.8107 14.2164 6.99678 14.92 7H18C19.0609 7 20.0783 7.42136 20.8284 8.17151C21.5786 8.92165 22 9.93913 22 11V17C22 18.0609 21.5786 19.0782 20.8284 19.8284C20.0783 20.5785 19.0609 21 18 21H6C4.93913 21 3.92172 20.5785 3.17157 19.8284C2.42142 19.0782 2 18.0609 2 17V7C2 5.93913 2.42142 4.92165 3.17157 4.17151C3.92172 3.42136 4.93913 3 6 3Z" stroke="${currentTheme === 'light' ? 'black' : 'white'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
  if (superGPTContainer?.querySelector('#supergpt-organize-folders') === null) {
    const containerDiv = $(
      `<div id="supergpt-organize-folders" style="color:${currentTheme === 'light' ? 'black' : 'white'};cursor:pointer;margin-top:15px;margin-left:10px;font-size:15px;display:flex;flex-direction:column;"><div style="display:flex;flex-direction:row;cursor:pointer;">${folderSVG} Organize Chats</div></div>`,
    );
    containerDiv.on('click', () => {
      $('#supergpt-organize-folders-modal').trigger('click');
    });
    $('.supergpt-sidebar-container').append(containerDiv);
  }
};
