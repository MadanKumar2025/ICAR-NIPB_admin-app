import React from "react";

function Footer() {
  return (
    <div>
      <footer className="app-footer">
        <div className="float-end d-none d-sm-inline">Anything you want</div>
        <strong>
          Copyright © 2014-
          <a href="https://adminlte.io" className="text-decoration-none">
            AdminLTE.io
          </a>
          .
        </strong>{" "}
        All rights reserved.
      </footer>
    </div>
  );
}

export default Footer;
