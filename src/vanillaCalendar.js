var vanillaCalendar = {
  month: document.querySelectorAll('[data-calendar-area="month"]')[0],
  weekdays: document.querySelectorAll('.vcal-week span'),
  next: document.querySelectorAll('[data-calendar-toggle="next"]')[0],
  previous: document.querySelectorAll('[data-calendar-toggle="previous"]')[0],
  label: document.querySelectorAll('[data-calendar-label="month"]')[0],
  activeDates: null,
  months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  daysShort: ['MON','TUE','WED','THU','FRI','SAT','SUN'],
  date: new Date(),
  todaysDate: new Date(),

  init: function (options) {
    this.options = options
    
    this.date.setDate(1)
	
    this.createLabels()
    this.createMonth()
    this.createListeners()
  },

  createListeners: function () {
    var _this = this
    this.next.addEventListener('click', function () {
      _this.clearCalendar()
      var nextMonth = _this.date.getMonth() + 1
      _this.date.setMonth(nextMonth)
      _this.createMonth()
    })
    // Clears the calendar and shows the previous month
    this.previous.addEventListener('click', function () {
      _this.clearCalendar()
      var prevMonth = _this.date.getMonth() - 1
      _this.date.setMonth(prevMonth)
      _this.createMonth()
    })
  },

  createLabels: function () {
    
	if (!this.options || !this.options.locale)  return false;
	
	var _this = this
	
	//months
	if (this.options.locale.months) 
		this.months = this.options.locale.months
	else if (this.options.locale.langID && this.date.toLocaleDateString) { 
		for (i = 0; i < 12; i++) { 
			var monthDate = new Date(Date.UTC(2000, i, 1, 1, 0, 0)),
				monthString =   monthDate.toLocaleDateString(_this.options.locale.langID,{month: 'long'})
		  
				_this.months[i] = monthString
		}
	}
	
	//days
	if (this.options.locale.daysShort) 
		this.daysShort = this.options.locale.daysShort;
	else if (this.options.locale.langID && this.date.toLocaleDateString) { 
		for (i = 0; i < 7; i++) { 
		  var dayDate = new Date(Date.UTC(2000, 0, 1, 1, 0, 0)),
			  dayString = "";
		  
			while (dayDate.getDay() !== i) {
				dayDate.setDate(dayDate.getDate() + 1);
			}
			
			dayString =  dayDate.toLocaleDateString(_this.options.locale.langID,{weekday: 'short'})
		  
		    _this.daysShort[i] = dayString.toUpperCase()
		}
		
		_this.daysShort.push(_this.daysShort.splice(0, 1)[0]); //push SUN to the end
	}	

	for (i = 0; i < 7; i++) { 	
	 _this.weekdays[i].innerHTML = _this.daysShort[i]
	}
  },

  createDay: function (num, day, year) {
    var newDay = document.createElement('div')
    var dateEl = document.createElement('span')
    dateEl.innerHTML = num
    newDay.className = 'vcal-date'
    newDay.setAttribute('data-calendar-date', this.date)

    // if it's the first day of the month
    if (num === 1) {
      if (day === 0) {
        newDay.style.marginLeft = (6 * 14.28) + '%'
      } else {
        newDay.style.marginLeft = ((day - 1) * 14.28) + '%'
      }
    }

    if (this.options && this.options.disablePastDays && this.date.getTime() <= this.todaysDate.getTime() - 1) {
      newDay.classList.add('vcal-date--disabled')
    } else {
      newDay.classList.add('vcal-date--active')
      newDay.setAttribute('data-calendar-status', 'active')
    }

    if (this.date.toString() === this.todaysDate.toString()) {
      newDay.classList.add('vcal-date--today')
    }

    newDay.appendChild(dateEl)
    this.month.appendChild(newDay)
  },

  dateClicked: function () {
    var _this = this
    this.activeDates = document.querySelectorAll(
      '[data-calendar-status="active"]'
    )
    for (var i = 0; i < this.activeDates.length; i++) {
      this.activeDates[i].addEventListener('click', function (event) {
        var picked = document.querySelectorAll(
          '[data-calendar-label="picked"]'
        )[0]
        picked.innerHTML = this.dataset.calendarDate
        _this.removeActiveClass()
        this.classList.add('vcal-date--selected')
      })
    }
  },

  createMonth: function () {
    var currentMonth = this.date.getMonth()
    while (this.date.getMonth() === currentMonth) {
      this.createDay(
        this.date.getDate(),
        this.date.getDay(),
        this.date.getFullYear()
      )
      this.date.setDate(this.date.getDate() + 1)
    }
    // while loop trips over and day is at 30/31, bring it back
    this.date.setDate(1)
    this.date.setMonth(this.date.getMonth() - 1)

    this.label.innerHTML =
    this.months[this.date.getMonth()] + ' ' + this.date.getFullYear()
    this.dateClicked()
  }
  ,
  clearCalendar: function () {
    vanillaCalendar.month.innerHTML = ''
  },

  removeActiveClass: function () {
    for (var i = 0; i < this.activeDates.length; i++) {
      this.activeDates[i].classList.remove('vcal-date--selected')
    }
  }
}