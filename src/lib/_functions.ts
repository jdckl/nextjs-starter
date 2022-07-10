const _Functions = {
  handleMobileMenuOpen: () => {
    const mobileMenu = document.getElementsByClassName('admin--mobileMenu')[0];
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('active');
  },

  handleMobileMenuClick: () => {
    const mobileMenu = document.getElementsByClassName('admin--mobileMenu')[0];
    mobileMenu.classList.remove('active');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 400);
  },
};

export default _Functions;
