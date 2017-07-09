export default {
  howLongAgo: function(dateObj) {
    const today = new Date(),
    tYear = today.getFullYear(),
    tMonth = today.getMonth() + 1,
    tDay = today.getDate() + 1,
    dYear = dateObj.getFullYear(),
    dMonth = dateObj.getMonth() + 1,
    dDay = dateObj.getDate() + 1;

    let yDiff = tYear - dYear;
    let mDiff = tMonth - dMonth;
    let dDiff = tDay - dDay;

    if (yDiff > 0) {
      // different year but within 12 months
      if (yDiff === 1 && mDiff < 0) {
        return (mDiff + 12) + 'mo';
      }
      else {
        return yDiff + 'y';
      }
    }
    else if (mDiff > 0) {
      return mDiff + 'mo';      
    }
    else if (dDiff > 0) {
      return dDiff + 'd';      
    }
    else {

    }

    return 'Error';
  },

  padZero: function(input) {
    let num = input;
    while (num.length < 6) {
      num = '0' + num;
    }
    return num;
  }
}