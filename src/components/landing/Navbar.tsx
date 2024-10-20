import logo from "../../assets/img/chaingov1.png";

const Navbar = () => {
  return (
    <nav className="border-border bg-background sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-14 w-auto" alt="ChainGo brand" />
          <span className="self-center text-2xl font-extrabold whitespace-nowrap text-accent">
            ChainGo
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-secondaryText rounded-lg md:hidden hover:bg-cardBackground focus:outline-none focus:ring-2 focus:ring-border"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-cardBackground md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <a
                href="#"
                className="block py-2 px-3 md:p-0 text-primaryText bg-accent rounded md:bg-transparent md:text-accent"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#functions"
                className="block py-2 px-3 md:p-0 text-primaryText rounded hover:bg-cardBackground md:hover:bg-transparent md:border-0 md:hover:text-accent"
              >
                Generate template
              </a>
            </li>
            <li>
              <a
                href="#functions"
                className="block py-2 px-3 md:p-0 text-primaryText rounded hover:bg-cardBackground md:hover:bg-transparent md:border-0 md:hover:text-accent"
              >
                Generate Smart Contract
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
