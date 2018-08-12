languages = {
  en: {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  es: {
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  }
};

class CalaCalendar {
  constructor(args = {}) {
    this.target = args.target;
    this.language = args.language || 'en';
    this.fdotw = args.fdotw || 'Sunday';
    this.elements = {};
    this.initElements();
    this.setDisplayedDate(args.displayedDate || new Date());
  }

  initElements() {
    // Wrapper
    this.target.classList.add('cala-calendar-wrapper');

    // Table
    this.elements.table = document.createElement("table");

    // Table Header
    this.elements.head = document.createElement("thead");
    this.elements.days = [];
    for (let i = 0; i < 7; i++) {
      let day = document.createElement('th');
      if (((i === 0 || i === 6) && this.fdotw === "Sunday") || ((i === 5 || i === 6) && this.fdotw === "Monday")) {
        day.classList.add('weekend')
      }
      let dayIndex = i;
      if (this.fdotw === 'Monday') {
        dayIndex = (i + 1) % 7;
      }
      day.textContent = languages[this.language].days[dayIndex][0];
      this.elements.head.appendChild(day);
    }
    this.elements.table.appendChild(this.elements.head);


    // HR Seperator - Sort of a hacky solution. :/
    let hrWrapper = document.createElement('td');
    hrWrapper.setAttribute('colspan', 7);
    hrWrapper.appendChild(document.createElement('hr'));
    this.elements.table.appendChild(hrWrapper);

    // Table Body
    this.elements.body = document.createElement("tbody");
    this.elements.table.appendChild(this.elements.body);
    this.elements.cells = [];
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");
      this.elements.body.appendChild(row);
      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");
        console.log(this.fdotw);
        if (((j === 0 || j === 6) && this.fdotw === "Sunday") || ((j === 5 || j === 6) && this.fdotw === "Monday")) {
          cell.classList.add('weekend');
        }
        this.elements.cells.push(cell);
        row.appendChild(cell);
      }
    }

    // Buttons
    this.elements.prevBtn = document.createElement("button");
    this.elements.nextBtn = document.createElement("button");
    this.elements.prevBtn.textContent = '<<';
    this.elements.nextBtn.textContent = '>>';
    this.elements.prevBtn.onclick = () => {
      this.changeMonth(-1);
    };
    this.elements.nextBtn.onclick = () => {
      this.changeMonth(1);
    };

    // Date Header
    this.elements.month_year = document.createElement('h3');
    this.elements.month_year.classList.add('cala-cal-month-year');

    // Calendar Row
    this.elements.calendar_row = document.createElement('div');
    this.elements.calendar_row.classList.add("cala-cal-row");
    this.elements.calendar_row.appendChild(this.elements.prevBtn);
    this.elements.calendar_row.appendChild(this.elements.table);
    this.elements.calendar_row.appendChild(this.elements.nextBtn);

    // Set Target Children
    this.target.appendChild(this.elements.month_year);
    this.target.appendChild(this.elements.calendar_row);

  };

  setDisplayedDate(date) {
    let d = new Date(Date.parse(date));
    if (!d instanceof Date || isNaN(d)) {
      d = new Date()
    }
    this.displayedDate = d;
    this.displayedMonth = this.displayedDate.getMonth();
    this.displayedYear = this.displayedDate.getFullYear();
    this.populateCalendar();
  }

  populateCalendar() {
    // Month/Year Title
    this.elements.month_year.textContent = `${languages[this.language].months[this.displayedMonth]} ${this.displayedYear}`;

    // Days
    let firstDay = (new Date(this.displayedYear, this.displayedMonth)).getDay();
    if (this.fdotw === 'Monday') {
      firstDay = (firstDay + 6) % 7;
    }

    let daysInMonth = 32 - new Date(this.displayedYear, this.displayedMonth, 32).getDate();
    for (let i = 0; i < this.elements.cells.length; i++) {
      if (i >= firstDay && i < firstDay + daysInMonth) {
        this.elements.cells[i].textContent = '' + (i - firstDay + 1);
      } else {
        this.elements.cells[i].textContent = '';
      }
    }
  }

  changeMonth(diff) {
    this.setDisplayedDate(new Date(this.displayedDate.getFullYear(), (1 + this.displayedDate.getMonth()) + diff, 0));
  }
}

(function () {
  window.addEventListener("load", function () {
    const calendars = Array.from(document.getElementsByClassName("auto-cala-calendar"));
    calendars
      .filter(c => c.getAttribute('loaded') !== 'true')
      .forEach(c => {
          c.setAttribute("loaded", "true");
          let options = Object.assign({}, c.dataset);
          options.target = c;
          new CalaCalendar(options);
        }
      )
  }, false);
})();
