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
        return (mDiff + 12) + ' month' + ((mDiff + 12) > 1 ? 's':'') + ' ago';
      }
      else {
        return yDiff + ' year' + (yDiff > 1 ? 's':'') + ' ago';
      }
    }
    else if (mDiff > 0) {
      return mDiff + ' month' + (mDiff > 1 ? 's':'') + ' ago';      
    }
    else if (dDiff > 0) {
      return dDiff + ' day' + (dDiff > 1 ? 's':'') + ' ago';      
    }
    else {

    }

    return 'Error';
  }
}