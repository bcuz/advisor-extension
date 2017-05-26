// Get dates to use
var startPeriodDate = new Date();
startPeriodDate.setDate(startPeriodDate.getDate() - 14)
var endPeriodDate = new Date();
endPeriodDate.setDate(endPeriodDate.getDate() - 1)

document.getElementById("records-to-date").value = endPeriodDate.toLocaleDateString()
document.getElementById("records-from-date").value = startPeriodDate.toLocaleDateString()
document.getElementById("get-records").click();

setTimeout(function() { document.getElementById("generate-invoice").click(); }, 1000)