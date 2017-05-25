
$.noConflict();
jQuery(document).ready(function($){

	const PAY_RATE = 15;

	// Defines the styles for the invoice. Pulled from the Google Sheet
	// The styles are then indexed using the class name
	const styles = {
		".s30" : `
		        background-color: #f4cccc;
		        text-align: left;
		        font-weight: bold;
		        font-style: italic;
		        color: #990000;
		        font-family: 'Arial';
		        font-size: 12pt;
		        vertical-align: middle;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,

		".s13" : `
		        background-color: #f3f3f3;
		        text-align: left;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: middle;
		        white-space: normal;
		        overflow: hidden;
		        word-wrap: break-word;
		        direction: ltr;
		        padding: 2px 20px 2px 3px; `,
		
		".s16" :
		       `background-color: #ffffff;
		        text-align: left;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: middle;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
	
		".s9" : `
		        background-color: #ffffff;
		        text-align: left;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: bottom;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
			    
		".s12" : `
		        background-color: #d9d9d9;
		        text-align: left;
		        font-weight: bold;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: bottom;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,

		".s21" : `
		        background-color: #fce5cd;
		        text-align: right;
		        font-weight: bold;
		        color: #cc4125;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: middle;
		        white-space: normal;
		        overflow: hidden;
		        word-wrap: break-word;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
	
		".s5" : `
		        background-color: #d9d9d9;
		        text-align: left;
		        font-weight: bold;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: bottom;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
	
		".s29" : `
		        background-color: #f4cccc;
		        text-align: right;
		        font-weight: bold;
		        color: #990000;
		        font-family: 'Arial';
		        font-size: 12pt;
		        vertical-align: middle;
		        white-space: normal;
		        overflow: hidden;
		        word-wrap: break-word;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
	
		".s8" : `
		        background-color: #ffffff;
		        text-align: left;
		        font-weight: bold;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: middle;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
	
		".s26" : `
		        background-color: #ffffff;
		        text-align: left;
		        color: #b7b7b7;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: middle;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
	
		".s4 "	:`
		        background-color: #d9d9d9;
		        text-align: left;
		        font-weight: bold;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: bottom;
		        white-space: normal;
		        overflow: hidden;
		        word-wrap: break-word;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
	
		".s24"	: `
		        background-color: #f3f3f3;
		        text-align: left;
		        font-weight: bold;
		        color: #b7b7b7;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: middle;
		        white-space: normal;
		        overflow: hidden;
		        word-wrap: break-word;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
		
		".s34" 	: `
				border: 1px solid #f3f3f3 !important;
		        background-color: #ffffff;
		        text-align: left;
		        color: #000000;
		        font-family: 'Calibri', Arial;
		        font-size: 11pt;
		        vertical-align: bottom;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
		
		".s11" 	: `
		        background-color: #ffffff;
		        text-align: left;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: bottom;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
		
		".s14" 	: `
		        background-color: #ffffff;
		        text-align: left;
		        font-weight: bold;
		        color: #333333;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: middle;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
		
		".s22" : `
		        background-color: #fce5cd;
		        text-align: left;
		        color: #cc4125;
		        font-family: 'Arial';
		        font-size: 11pt;
		        vertical-align: middle;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
		
		"td"	: "border: 1px solid #ffffff;",

	}

	/**
	 *	Given an object containing a time clock record, get an invoice item
	 *
	 *	@param {object} - The object with the record data
	 *	@return {HTML Element} - An HTML table row with the record data
	 */
	function gen_invoice_item(invoice_item){
		return `
			<tr style='height:25px;' id="invoice-item">
                <td class="s34" id="date">${invoice_item.date}</td>
                <td class="s34" id="first-name">${invoice_item.fname}</td>
                <td class="s34" id="last-name">${invoice_item.lname}</td>
                <td class="s34" id="position">${invoice_item.pos}</td>
                <td class="s34" id="location">${invoice_item.loc}</td>
                <td class="s34" id="site"></td>
                <td class="s34" id="clock-in">${invoice_item.in}</td>
                <td class="s34" id="clock-out">${invoice_item.out}</td>
                <td class="s34" id="hours-worked">${invoice_item.span}</td>
            </tr>
		`;
	}

	/** 
	 *	Generate the invoice HTML/CSS
	 *
	 *	@param basic_info {object} - An object containing the basic info needed for the invoice
	 *	@param invoice_items {array} - An array containing invoice_item objects
	 *
	 *	@return {HTML table} - The invoice as an HTML table
	 */
	function create_invoice(basic_info, invoice_items){

		// Generate the actual time records
		let items = '';

		for(let i = 0; i < invoice_items.length; ++i){
			items += gen_invoice_item(invoice_items[i]);
		}


		// Create the invoice 
		// Needs cleanup
		let invoice = `
			<div>
		    <table class="waffle" cellspacing="0" cellpadding="0" style="border:1px solid #f3f3f3">
		        <tbody>
		            <tr style='height:10px;'>
		                <td class="s12" colspan="9"></td>
		            </tr>
		             <tr style='height:30px;'>
		                <td class="s8"  colspan="9"  id="advisor-name">${basic_info.name}</td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s8" colspan="9" >
		                    ${basic_info.email}
		                </td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s8" colspan="9" id="address">
		                    ${basic_info.addr}
		                </td>
		            </tr>
		            <tr style='height:10px;'>
		                <td class="s12"  colspan="9"></td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13" > <strong>To:</strong> <br> Codecademy </td>
		                <td class="s8" colspan="8"></td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13" >49 West 27th Street - 4th Floor</td>
		                <td class="s8" colspan="8"></td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13" >New York, NY 10001</td>
		                <td class="s8" colspan="8"></td>
		            </tr>
		            <tr style='height:10px;'>
		                <td class="s12"  colspan="9"></td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13"  >DESCRIPTION OF SERVICES</td>
		                <td class="s14"   colspan="8">Codecademy Consultant</td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13"  >BILLING PERIOD DATES</td>
		                <td class="s16"  colspan="8"  id="dates">
		                    ${basic_info.dates}
		                </td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13"  >INVOICE DUE DATE</td>
		                <td class="s16"   colspan="8" id="due-date">${basic_info.due_date}</td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13" >MANAGER</td>
		                <td class="s16"   colspan="8">Daniella Kisza</td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13"  >TOTAL HOURS WORKED</td>
		                <td class="s16"   colspan="8" id="total-hours">${basic_info.total_hours}</td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s13"  >YOUR HOURLY
		                    <br>COMPENSATION RATE ($ / hour) &nbsp;&nbsp;&nbsp;</td>
		                <td class="s16"   colspan="8">$15.00</td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s21"  >Subtotal =</td>
		                <td class="s22" colspan="8" id="subtotal">$ ${basic_info.subtotal}</td>
		            </tr>
		            <tr style='height:39px;'>
		                <td class="s24"  >HOURS - Holiday
		                    <br><span style="font-weight:normal;">(where time and a half applies)</span>
		                </td>
		                <td class="s26"   colspan="8">0.00</td>
		            </tr>
		            <tr style='height:40px;'>
		                <td class="s24"   >HOLIDAY
		                    <br>COMPENSATION RATE ($ / hour)</td>
		                <td class="s26"  colspan="8">$22.50</td>
		            </tr>
		            <tr style='height:30px;'>
		                <td class="s21"  >Subtotal =</td>
		                <td class="s22" colspan="8">0</td>
		            </tr>
		            <tr style='height:38px;'>
		                <td class="s29"> $ TOTAL =</td>
		                <td class="s30" colspan="8" id="total-pay">$ ${basic_info.total}</td>
		            </tr>
		            <tr style='height:40px;'>
		                <td class="s12" >Date</td>
		                <td class="s12" >First Name &nbsp;&nbsp;</td>
		                <td class="s12" >Last Name &nbsp;&nbsp;</td>
		                <td class="s12" >Position &nbsp;&nbsp;</td>
		                <td class="s12" >Location &nbsp;&nbsp;</td>
		                <td class="s12" >Site &nbsp;&nbsp;</td>
		                <td class="s12" >Start Time &nbsp;&nbsp;</td>
		                <td class="s12" >End Time &nbsp;&nbsp;</td>
		                <td class="s12" >Length &nbsp;&nbsp;</td>
		            </tr>
		            <div class="invoice-items">
		            	${items}
		            </div>
		        </tbody>
		    </table>
		    </div>
		`;

		// Apply CSS to the table
		let htm = $(invoice);
		let tds = htm.find('td');
		tds.each(function (id, el){
			let el_ = $(el);
			el_.attr('style', styles['.'+el_.attr('class')]+styles.td);
		});

		return htm.html();
	}


	let basic_info = {
		name: '-',
		email: '-',
		addr: '-',
		dates: '-',
		due_date: '-',
		total_hours: 0,
		subtotal: 0,
		total: 0
	};
	let invoice_items = [];
	let advisor_name = '';

	// Main function to generate an invoice
	function run(){
		// Clear array
		invoice_items = [];

		// First get basic info
		basic_info.name = basic_info.name === "YOUR NAME HERE" ? $("#timesheet .header h2").text() : basic_info.name;

		// The invoice dates
		let dates = $("#timesheet .header h2 span").text();
		basic_info.dates = dates;

		// The due date
		let tmp_date = new Date();
		let due_date = tmp_date.getMonth()+1 + "/" + tmp_date.getDate() + "/" + tmp_date.getFullYear();
		basic_info.due_date = due_date;

		// Total hours worked
		let total_hours = $("#id-timesheet-total").attr('data-total');
		basic_info.total_hours = total_hours;

		// Pay due
		basic_info.subtotal = (PAY_RATE*parseFloat(total_hours));
		basic_info.total = basic_info.subtotal;

		// Split advisor name
		let index = advisor_name.lastIndexOf(' ');
		let first_name = advisor_name.substr(0, index);
		let last_name = advisor_name.substr(index+1);

		// Find all the shift records
		let pot_items = $(".list.times-list li");
		pot_items.each(function(id, li){
			let item = $(li);
			if(item.find('.time-total-col span').attr('data-total') !== '-'){
				let i = {
					'date': '',
					'fname': '',
					'lname': '',
					'pos': '',
					'loc': '',
					'in': '',
					'out': '',
					'span': ''
				};
				i.date = item.find('.day-col strong').text() +  " " + item.find('.day-col span').text();
				i.fname = first_name;
				i.lname = last_name;
				i.in = item.find('.col-in input').attr('value');
				i.out = item.find('.col-out input').attr('value');
				i.pos = item.find('.col-tags .position').text();
				i.loc = item.find('.col-tags .location').text();
				i.span = item.find('.time-total-col span').attr('data-total');

				invoice_items.push(i);
			}
		});
		
		
		
	}

	setTimeout(function(){


		chrome.storage.sync.get({'advisorName': 'YOUR NAME HERE', 'advisorEmail': 'YOUR EMAIL HERE', 'advisorAddress': 'YOUR ADDRESS HERE', }, 
			function(data) {
				advisor_name = data.advisorName;
				basic_info.name = (data.advisorName);
				basic_info.email = (data.advisorEmail);
				basic_info.addr = (data.advisorAddress);

				$(".payroll-info-card section").click();
				$(".payperiod-dropdown ul div:eq(2)").click();
				setTimeout(function(){
					

					$("#timesheet .header").prepend('<a href="#" class="button-kit green medium" id="gen-invoice"> Generate Invoice</a>');
					$(document).on('click', "#gen-invoice", function(e){
						run();

						let invoice = create_invoice(basic_info, invoice_items);
						e.preventDefault();


						let a = document.createElement('a');
						a.setAttribute('href', 'data:text/calendar,' + encodeURIComponent(invoice));
						a.setAttribute('download', 'codecademy_invoice.xls');

						a.click();
					});

					$("#gen-invoice").click();
				}, 500);
				
			}
		);

		
	}, 2000);

});
