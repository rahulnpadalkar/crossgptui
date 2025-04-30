export const addContainer = () => {
  const sidebar = document.querySelector('div.group\\/sidebar');
  if (sidebar?.querySelector('.supergpt-sidebar-container') === null) {
    const container = document.createElement('div');
    container.className = 'supergpt-sidebar-container';
    sidebar.insertBefore(container, sidebar.childNodes[3]);
  }
};
