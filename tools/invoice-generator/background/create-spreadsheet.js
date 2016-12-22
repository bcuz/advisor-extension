import { getShiftRows, emptyRow, emptyCols } from './util'
import styles from './styles'

/**
 * Creates a spreadsheet by generating an HTML table
 * and then converting it into an excel document
 *
 * @param  {object} invoiceInfo
 * @return {string}
 */
function createSpreadsheet(invoiceInfo) {
  const table = generateTable(invoiceInfo)
  const url = tableToExcel(table)

  return url
}

/**
 * Generates an HTML table using static information
 * as well as dynamically generating the rest of the
 * invoice by using the invoiceInfo given as input
 *
 * @param {string} invoiceInfo.userName
 * @param {string} invoiceInfo.totalHours
 * @param {string} invoiceInfo.startDate
 * @param {string} invoiceInfo.endDate
 * @param {array}  invoiceInfo.shifts
 * @return {object}
 */
function generateTable({ userName, advisorEmail, advisorAddress, totalHours, startDate, endDate, shifts }) {
  const worksheet = `${userName} Invoice Template`
  const hoursNum = parseFloat(totalHours)
  const hourlyRate = 15
  const totalAmount = (hoursNum * hourlyRate).toFixed(2)

  const template = `
    <table style="${styles.table}" cellpadding="5" border="1" bordercolor="EEEEEE">
      <tr>
        <td style="${styles.topHeader}" colspan="6">Please make sure to submit your invoice as a PDF (File > Save As > PDF)</td>
      </tr>
      <tr>
        <td style="${styles.subHeaders.top}" colspan="6"><em>*Invoices should be emailed directly to Codecademy@bill.com or faxed to 646.365.7939</em></td>
      </tr>
      <tr>
        <td style="${styles.subHeaders.bottom}" colspan="6"><em>*If you're a new advisor, please be sure to attach your W-9 form!</em></td>
      </tr>
      ${emptyRow()}
      <tr>
        <td><strong>To: Codecademy</strong></td>
        ${emptyCols(5)}
      </tr>
      <tr>
        <td><strong>49 West 27th Street - 4th Floor</strong></td>
        ${emptyCols(5)}
      </tr>
      <tr>
        <td><strong>New York, NY 10001</strong></td>
        ${emptyCols(5)}
      </tr>
      ${emptyRow()}
      <tr>
        <td><strong>${userName}</strong></td>
        ${emptyCols(5)}
      </tr>
      <tr>
        <td><strong>${advisorEmail || 'YOUR EMAIL HERE'}</strong></td>
        ${emptyCols(5)}
      </tr>
      <tr>
        <td><strong>${advisorAddress || 'YOUR ADDRESS HERE'}</strong></td>
        ${emptyCols(5)}
      </tr>
      ${emptyRow()}
      <tr>
        <td><strong>DESCRIPTION OF SERVICES</strong></td>
        <td colspan="5" style="${styles.alignFix}"><strong>Codecademy Consultant</strong></td>
      </tr>
      <tr>
        <td><strong>BILLING PERIOD DATES</strong></td>
        <td colspan="5"><strong>${startDate} - ${endDate}</strong></td>
      </tr>
      <tr>
        <td><strong>INVOICE DUE DATE</strong></td>
        <td colspan="5" style="${styles.alignFix}"><strong>${new Date().toLocaleDateString()}</strong></td>
      </tr>
      <tr>
        <td><strong>MANAGER</strong></td>
        <td colspan="5" style="${styles.alignFix}"><strong>Daniella Kisza</strong></td>
      </tr>
      <tr>
        <td style="${styles.heightFix}"><strong>TOTAL HOURS WORKED / <br style="mso-data-placement:same-cell;" >CLOCKED IN ON TRACKSMART</strong></td>
        <td colspan="5" style="${styles.alignFix}"><strong>${hoursNum}</strong></td>
      </tr>
      <tr>
        <td><strong>HOURLY COMPENSATION RATE ($/HR)</strong></td>
        <td colspan="5" style="${styles.alignFix}"><strong>$15.00</strong></td>
      </tr>
      <tr>
        <td style="${styles.heightFix}"><strong>HOLIDAY (time and a half) <br style="mso-data-placement:same-cell;">HOURLY COMPENSATION RATE ($/HR)</strong></td>
        <td colspan="5" style="${styles.alignFix}"><strong>$22.50</strong></td>
      </tr>
      <tr style="${styles.subHeaders.top}">
        <td><strong>TOTAL AMOUNT</strong></td>
        <td colspan="5" style="${styles.alignFix}"><strong>$ ${totalAmount}</strong></td>
      </tr>
      <tr style="${styles.shiftInfo}">
        <td colspan="5" style="${styles.alignFix}"><strong>Activity Overview</strong></td>
        <td style="${styles.heightFix}"><strong>TOTAL <br style="mso-data-placement:same-cell;" >Length / Duration <br style="mso-data-placement:same-cell;" >(Hours, Minutes)</strong></td>
      </tr>
      <tr>
        <td><em>ITEM 1 (i.e. Onboarding Hours)</em></td>
        <td colspan="4"></td>
        <td style="${styles.alignFix}"><strong>0.00</strong></td>
      </tr>
      <tr>
        <td><em>ITEM 2 (i.e. Advisor Shifts)</em></td>
        <td colspan="4"></td>
        <td style="${styles.alignFix}"><strong>${hoursNum}</strong></td>
      </tr>
      <tr>
        <td><em>ITEM 3 (i.e. Advisor Shifts - Holiday Hours)</em></td>
        <td colspan="4"></td>
        <td style="${styles.alignFix}"><strong>0.00</strong></td>
      </tr>
      <tr>
        <td><em>ITEM 4 (i.e. Mentor Hours)</em></td>
        <td colspan="4"></td>
        <td style="${styles.alignFix}"><strong>0.00</strong></td>
      </tr>
      <tr style="${styles.shiftInfo}">
        <td><strong>Detailed Description / Note</strong></td>
        <td><strong>Role / Location</strong></td>
        <td><strong>Date</strong></td>
        <td><strong>Clock In</strong></td>
        <td><strong>Clock Out</strong></td>
        <td style="${styles.heightFix}"><strong>Length / Duration <br style="mso-data-placement:same-cell;"> (Hours, Minutes)</strong></td>
      </tr>
      ${getShiftRows(shifts)}
    </table>
  `

  const table = { template, worksheet }

  return table
}

/**
 * Converts an HTML table to an excel sheet
 *
 * @param  {string} table.template
 * @param  {string} table.worksheet
 * @return {string}
 */
function tableToExcel({ template, worksheet }) {
  const base64 = s => window.btoa(unescape(encodeURIComponent(s)))
  const uri = 'data:application/vnd.ms-excel;base64,'
  const excelTemplate = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${template}</table></body></html>`

  return uri + base64(excelTemplate)
}

export default createSpreadsheet
