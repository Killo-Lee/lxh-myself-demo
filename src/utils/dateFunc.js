import moment from 'moment';

let dateFunc = {
    /**
    'YYYY-MM-DD hh:mm:ss'
    HH:mm:ss
    date->string
    **/
    format(date,format){
        if(!date){
            return "";
        }
        return moment(date).format(format);
    },
    //string->date
    toDate(date,format){
        if(!date){
            return "";
        }
        return moment(date, format);
    },
    getRelativeMonth(date,num,format){
        return moment(date).subtract('month', num).format(format)
    },
    getRelativeDay(date,num,format){
        return moment(date).subtract('day', num).format(format)
    },
    getMonthViewStartDate(date, firstDay) {
        firstDay = parseInt(firstDay);
        let start = moment(date);
        let startOfMonth = moment(start.startOf('month'));

        start.subtract(startOfMonth.day(), 'days');

        if (startOfMonth.day() < firstDay) {
            start.subtract(7, 'days');
        }

        start.add(firstDay, 'days');

        return start;
    },

    getMonthViewEndDate(date) {
        return this.getMonthViewStartDate().add(6, 'weeks');
    },

    generateMonthDay(date) {
        const daysArr = [
            [],
            [],
            [],
            [],
            [],
            []
        ]; // 6*7的日历数组
        const currentWeekday = moment(date).date(1).weekday(); // 获取当月1日为星期几
        const lastMonthDays = moment(date).subtract(1, 'month').daysInMonth(); // 获取上月天数
        const currentMonthDays = moment(date).daysInMonth(); // 获取当月天数

        const getDay = day => (day <= lastMonthDays ? day : (day <= (lastMonthDays + currentMonthDays)) ? day - lastMonthDays : day - (lastMonthDays + currentMonthDays)); // 日期处理
        for (let i = 0; i < 7; i += 1) {
            let virtualDay = (lastMonthDays - currentWeekday) + i + 1;
            for (let j = 0; j < 6; j += 1) {
                daysArr[j][i] = getDay(virtualDay + (j * 7));
            }
        }
        //console.table(daysArr);

        const weekNames   = ['周日', '周一','周二','周三','周四','周五','周六'];
        const monthDay = [];
        let reach = false;
        for(let i in daysArr){
          for(let j in daysArr[i]){
            let itemDay = daysArr[i][j];
            if(itemDay === 1){
              reach = true;
            }
            if(reach){
                let mDay = itemDay
                if(itemDay<10){
                    mDay = "0"+itemDay;
                }
              monthDay.push({
                month:moment(date).get('month')+1,  
                day:mDay,
                week:weekNames[j]
              })
            }
            if(monthDay.length == currentMonthDays){
              break;
            }
          }
          if(monthDay.length == currentMonthDays){
            break;
          }
        }
        return monthDay;
    },
};

export default dateFunc;
