module.exports = (date) => {
    let dd = new Date(date).getDate();
    let mm = new Date(date).getMonth() + 1;
    let yyyy = new Date(date).getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}