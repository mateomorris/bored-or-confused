export function showClassIdPopop(classId) {
    var win = window.open("", "BoC - Class ID", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=200,height=50,top="+(screen.height-400)+",left="+(screen.width-840));
    win.document.body.innerHTML = `
      <style>
        body {
          margin: 0;
        }
        #container {
          background-color:rgb(47,47,47);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100vh;
        }

        #container > h1 {
          font-family:sans-serif;
          color:white;
          text-align:center;
          font-size: 10vw;
          margin-bottom: 0;
        }

        #container > h2 {
          font-family:sans-serif;
          color:white;
          text-align:center;
          font-size: 5vw;
          margin-top: 0.25rem;
          font-weight: 400;
        }

        #container span {
          text-decoration: underline;
        }
      </style>
      <div id="container">
        <h1>
          Class ID: <span>${classId}</span>
        </h1>
        <h2>
          boredorconfused.com
        </h2>
      </div>
    `;
  }