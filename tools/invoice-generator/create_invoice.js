
$.noConflict();
jQuery(document).ready(function($){

	const PAY_RATE = 15;

	// Defines the styles for the invoice. Pulled from the Google Sheet
	// The styles are then indexed using the class name
	const styles = {
		"a": "color: inherit;",
		".s30" : `border-bottom: 1px SOLID #f4cccc;
		        border-right: 1px SOLID #f4cccc;
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

		".s0": `
		        border-bottom: 1px SOLID #ffffff;
		        background-color: #d9d9d9;
		        text-align: left;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 10pt;
		        vertical-align: bottom;
		        white-space: normal;
		        overflow: hidden;
		        word-wrap: break-word;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,

		".s13" : `
		        border-bottom: 1px SOLID #ffffff;
		        border-right: 1px SOLID #ffffff;
		        background-color: #f3f3f3;
		        text-align: left;
		        font-weight: bold;
		        color: #000000;
		        font-family: 'Arial';
		        font-size: 10pt;
		        vertical-align: middle;
		        white-space: normal;
		        overflow: hidden;
		        word-wrap: break-word;
		        direction: ltr;
		        padding: 2px 3px 2px 3px; `,
		
		".s16" :
		       `border-right: none;
		        background-color: #ffffff;
		        text-align: left;
		        font-style: italic;
		        color: #999999;
		        font-family: 'Arial';
		        font-size: 10pt;
		        vertical-align: middle;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
			    
		".s25" : `
		        border-bottom: 1px SOLID #ffffff;
		        border-right: 1px SOLID #ffffff;
		        background-color: #ffffff;
		        text-align: left;
		        font-style: italic;
		        color: #b7b7b7;
		        font-family: 'Arial';
		        font-size: 10pt;
		        vertical-align: middle;
		        white-space: nowrap;
		        direction: ltr;
		        padding: 2px 3px 2px 3px;`,
			    
		".s32" : 	`
			        background-color: #d9d9d9;
			        text-align: left;
			        font-weight: bold;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: normal;
			        overflow: hidden;
			        word-wrap: break-word;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s33" : `
			        background-color: #ffffff;
			        text-align: right;
			        color: #000000;
			        font-family: 'Calibri', Arial;
			        font-size: 11pt;
			        vertical-align: bottom;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s9" : `
			        border-left: none;
			        background-color: #ffffff;
			        text-align: left;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
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
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s3" : `
			        border-bottom: 1px SOLID #ffffff;
			        border-right: 1px SOLID #ffffff;
			        background-color: #ffffff;
			        text-align: left;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s23" : `
			        border-bottom: 1px SOLID #efefef;
			        border-right: 1px SOLID #efefef;
			        background-color: #fce5cd;
			        text-align: left;
			        font-weight: bold;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s2" : `
			        border-bottom: 1px SOLID #ffffff;
			        border-right: 1px SOLID #ffffff;
			        background-color: #f3f3f3;
			        text-align: left;
			        font-weight: bold;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: normal;
			        overflow: hidden;
			        word-wrap: break-word;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s27" : `
			        border-bottom: 1px SOLID #efefef;
			        border-right: 1px SOLID #efefef;
			        background-color: #fce5cd;
			        text-align: right;
			        font-weight: bold;
			        color: #cc4125;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: normal;
			        overflow: hidden;
			        word-wrap: break-word;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,

		".s21" : `
			        border-bottom: 1px SOLID #ffffff;
			        border-right: 1px SOLID #efefef;
			        background-color: #fce5cd;
			        text-align: right;
			        font-weight: bold;
			        color: #cc4125;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: normal;
			        overflow: hidden;
			        word-wrap: break-word;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,

		".s31" : `
			        border-bottom: 1px SOLID #f4cccc;
			        border-right: 1px SOLID #f4cccc;
			        background-color: #f4cccc;
			        text-align: left;
			        font-weight: bold;
			        font-style: italic;
			        color: #990000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s5" : `
			        border-bottom: 1px SOLID #ffffff;
			        background-color: #d9d9d9;
			        text-align: left;
			        font-weight: bold;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s19" : `
			        border-bottom: 1px SOLID #ffffff;
			        border-right: 1px SOLID #ffffff;
			        background-color: #ffffff;
			        text-align: left;
			        font-style: italic;
			        color: #999999;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s29" : `
			        border-bottom: 1px SOLID #f4cccc;
			        border-right: 1px SOLID #f4cccc;
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
			        border-right: none;
			        background-color: #ffffff;
			        text-align: left;
			        font-weight: bold;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s26" : `
			        border-bottom: 1px SOLID #efefef;
			        background-color: #ffffff;
			        text-align: left;
			        color: #b7b7b7;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s4 "	:`
			        border-bottom: 1px SOLID #ffffff;
			        background-color: #d9d9d9;
			        text-align: left;
			        font-weight: bold;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: normal;
			        overflow: hidden;
			        word-wrap: break-word;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,

		".s18" 	: `
			        border-bottom: 1px SOLID #ffffff;
			        background-color: #ffffff;
			        text-align: left;
			        font-style: italic;
			        color: #999999;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
	
		".s24"	: `
			        border-bottom: 1px SOLID #ffffff;
			        background-color: #f3f3f3;
			        text-align: left;
			        font-weight: bold;
			        color: #b7b7b7;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: normal;
			        overflow: hidden;
			        word-wrap: break-word;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,

		".s20" 	: `
			        border-bottom: 1px SOLID #efefef;
			        background-color: #ffffff;
			        text-align: left;
			        font-style: italic;
			        color: #999999;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s28" 	: `
			        border-bottom: 1px SOLID #efefef;
			        border-right: 1px SOLID #efefef;
			        background-color: #fce5cd;
			        text-align: left;
			        font-weight: bold;
			        color: #073763;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,

		".s17" : `
			        border-left: none;
			        background-color: #ffffff;
			        text-align: left;
			        font-style: italic;
			        color: #999999;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s34" 	: `
			        background-color: #ffffff;
			        text-align: left;
			        color: #000000;
			        font-family: 'Calibri', Arial;
			        font-size: 11pt;
			        vertical-align: bottom;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s6" 	: `
			        border-bottom: 1px SOLID #ffffff;
			        border-right: 1px SOLID #ffffff;
			        background-color: #f3f3f3;
			        text-align: left;
			        font-weight: bold;
			        font-style: italic;
			        color: #999999;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: normal;
			        overflow: hidden;
			        word-wrap: break-word;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s11" 	: `
			        border-left: none;
			        border-right: none;
			        background-color: #ffffff;
			        text-align: left;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s15" 	: `
			        border-bottom: 1px SOLID #ffffff;
			        background-color: #ffffff;
			        text-align: left;
			        font-weight: bold;
			        color: #333333;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s7" 	: `
			        border-bottom: 1px SOLID #ffffff;
			        border-right: 1px SOLID #ffffff;
			        background-color: #ffffff;
			        text-align: left;
			        font-weight: bold;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,

		".s1" : `
			        border-bottom: 1px SOLID #ffffff;
			        background-color: #d9d9d9;
			        text-align: left;
			        color: #000000;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: bottom;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s14" 	: `
			        border-bottom: 1px SOLID #ffffff;
			        border-right: 1px SOLID #ffffff;
			        background-color: #ffffff;
			        text-align: left;
			        font-weight: bold;
			        color: #333333;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s22" : `
			        border-bottom: 1px SOLID #efefef;
			        border-right: 1px SOLID #efefef;
			        background-color: #fce5cd;
			        text-align: left;
			        color: #cc4125;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: middle;
			        white-space: nowrap;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		".s10"	: `
			        border-bottom: 1px SOLID #ffffff;
			        border-right: 1px SOLID #ffffff;
			        background-color: #f3f3f3;
			        text-align: left;
			        font-weight: bold;
			        font-style: italic;
			        color: #999999;
			        font-family: 'Arial';
			        font-size: 10pt;
			        vertical-align: top;
			        white-space: normal;
			        overflow: hidden;
			        word-wrap: break-word;
			        direction: ltr;
			        padding: 2px 3px 2px 3px;`,
		
		"td"	: "border: 1px solid #f3f3f3;",

	}

	/**
	 *	Given an object containing a time clock record, get an invoice item
	 *
	 *	@param {object} - The object with the record data
	 *	@return {HTML Element} - An HTML table row with the record data
	 */
	function gen_invoice_item(invoice_item){
		return `
			<tr style='height:23px;' id="invoice-item">
                <td class="s33"  style="${styles['.s33']} ${styles.td}" dir="ltr" id="date">${invoice_item.date}</td>
                <td class="s34" style="${styles['.s34']} ${styles.td}" dir="ltr" id="first-name">${invoice_item.fname}</td>
                <td class="s34" style="${styles['.s34']} ${styles.td}" dir="ltr" id="last-name">${invoice_item.lname}</td>
                <td class="s34" style="${styles['.s34']} ${styles.td}" dir="ltr" id="position">${invoice_item.pos}</td>
                <td class="s34" style="${styles['.s34']} ${styles.td}" dir="ltr" id="location">${invoice_item.loc}</td>
                <td class="s34" style="${styles['.s34']} ${styles.td}" id="site"></td>
                <td class="s33" style="${styles['.s33']} ${styles.td}" dir="ltr" id="clock-in">${invoice_item.in}</td>
                <td class="s33" style="${styles['.s33']} ${styles.td}" dir="ltr" id="clock-out">${invoice_item.out}</td>
                <td class="s33" style="${styles['.s33']} ${styles.td}" dir="ltr" id="hours-worked">${invoice_item.span}</td>
            </tr>
		`;
	}

	/** 
	 *	Generate the invoice HTML/CSS
	 *
	 *	@param basic_info {array} - An array containing the basic info needed for the invoice
	 *	@param invoice_items {array} - An array containing invoice_item objects
	 *
	 *	@return {HTML table} - The invoice as an HTML table
	 */
	function create_invoice(basic_info, invoice_items){

		// Should use object
		let name = basic_info[0], email = basic_info[1], address = basic_info[2],
			dates = basic_info[3], due_date = basic_info[4], hours = basic_info[5],
			subtotal = basic_info[6], total = basic_info[7];


		// Generate the actual time records
		let items = '';

		for(let i = 0; i < invoice_items.length; ++i){
			items += gen_invoice_item(invoice_items[i]);
		}


		// Create the invoice 
		// Needs cleanup
		let invoice = `
		    <table class="waffle" cellspacing="0" cellpadding="0">
		        <thead>

		        </thead>
		        <tbody>
		            <tr style='height:8px;'>
		                <td class="s0" style="${styles['.s0']} ${styles.td}"></td>
		                <td class="s1" style="${styles['.s1']} ${styles.td}"></td>
		                <td class="s1" style="${styles['.s1']} ${styles.td}"></td>
		                <td class="s1" style="${styles['.s1']} ${styles.td}"></td>
		                <td class="s1" style="${styles['.s1']} ${styles.td}"></td>
		                <td class="s1" style="${styles['.s1']} ${styles.td}"></td>
		                <td class="s1" style="${styles['.s1']} ${styles.td}"></td>
		                <td class="s1" style="${styles['.s1']} ${styles.td}"></td>
		                <td class="s1" style="${styles['.s1']} ${styles.td}"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s2" style="${styles['.s2']} ${styles.td}">To: Codecademy </td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s2" style="${styles['.s2']} ${styles.td}">49 West 27th Street - 4th Floor</td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s2" style="${styles['.s2']} ${styles.td}">New York, NY 10001</td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		            </tr>
		            <tr style='height:8px;'>
		                <td class="s4" style="${styles['.s4']} ${styles.td}" colspan="6"></td>
		                <td class="s5" style="${styles['.s5']} ${styles.td}" ></td>
		                <td class="s5" style="${styles['.s5']} ${styles.td}" ></td>
		                <td class="s5" style="${styles['.s5']} ${styles.td}" ></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s6" style="${styles['.s6']} ${styles.td}" dir="ltr"></td>
		                <td class="s7" style="${styles['.s7']} ${styles.td}" dir="ltr" id="advisor-name">${name}</td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s6" style="${styles['.s6']} ${styles.td}" dir="ltr"></td>
		                <td class="s8 style="${styles['.s8']} ${styles.td}" softmerge" dir="ltr">
		                    <div class="softmerge-inner" style="width: 260px; left: -1px;" id="advisor-email">${email}</div>
		                </td>
		                <td class="s9" style="${styles['.s9']} ${styles.td}" ></td>
		                <td class="s9" style="${styles['.s9']} ${styles.td}" ></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s10" style="${styles['.s10']} ${styles.td}" dir="ltr"></td>
		                <td class="s8 style="${styles['.s8']} ${styles.td}" softmerge" dir="ltr">
		                    <div class="softmerge-inner" style="width: 432px; left: -1px;" id="advisor-address">${address}</div>
		                </td>
		                <td class="s11" style="${styles['.s11']} ${styles.td}"></td>
		                <td class="s11" style="${styles['.s11']} ${styles.td}"></td>
		                <td class="s9" style="${styles['.s9']} ${styles.td}"></td>
		                <td class="s9" style="${styles['.s9']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		                <td class="s3" style="${styles['.s3']} ${styles.td}"></td>
		            </tr>
		            <tr style='height:8px;'>
		                <td class="s4" style="${styles['.s4']} ${styles.td}" colspan="6"></td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}"></td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}"></td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s13" style="${styles['.s13']} ${styles.td}" >DESCRIPTION OF SERVICES</td>
		                <td class="s14" style="${styles['.s14']} ${styles.td}" dir="ltr" colspan="5">Codecademy Consultant</td>
		                <td class="s14" style="${styles['.s14']} ${styles.td}" dir="ltr"></td>
		                <td class="s14" style="${styles['.s14']} ${styles.td}" dir="ltr"></td>
		                <td class="s15" style="${styles['.s15']} ${styles.td}"  dir="ltr"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s13" style="${styles['.s13']} ${styles.td}" dir="ltr">BILLING PERIOD DATES</td>
		                <td class="s16 style="${styles['.s16']} ${styles.td}" softmerge" dir="ltr">
		                    <div class="softmerge-inner" style="width: 260px; left: -1px;" id="date-range">${dates}</div>
		                </td>
		                <td class="s17" style="${styles['.s17']} ${styles.td}" dir="ltr"></td>
		                <td class="s17" style="${styles['.s17']} ${styles.td}" dir="ltr"></td>
		                <td class="s18" style="${styles['.s18']} ${styles.td}" dir="ltr"></td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s18" style="${styles['.s18']} ${styles.td}" dir="ltr"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s13" style="${styles['.s13']} ${styles.td}" dir="ltr">INVOICE DUE DATE</td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr" colspan="5" id="due-date">${due_date}</td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s18" style="${styles['.s18']} ${styles.td}" dir="ltr"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s13" style="${styles['.s13']} ${styles.td}">MANAGER</td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr" colspan="5">Daniella Kisza</td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s18" style="${styles['.s18']} ${styles.td}" dir="ltr"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s13" style="${styles['.s13']} ${styles.td}" dir="ltr">TOTAL HOURS WORKED</td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr" colspan="5" id="total-hours">${hours}</td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s19" style="${styles['.s19']} ${styles.td}" dir="ltr"></td>
		                <td class="s18" style="${styles['.s18']} ${styles.td}" dir="ltr"></td>
		            </tr>
		            <tr style='height:25px;'>
		                <td class="s13" style="${styles['.s13']} ${styles.td}" dir="ltr">YOUR HOURLY
		                    <br>COMPENSATION RATE ($ / hour)</td>
		                <td class="s20" style="${styles['.s20']} ${styles.td}" dir="ltr" colspan="8">$15.00</td>
		            </tr>
		            <tr style='height:26px;'>
		                <td class="s21" style="${styles['.s21']} ${styles.td}" dir="ltr">Subtotal =</td>
		                <td class="s22" style="${styles['.s22']} ${styles.td}" dir="ltr" id="subtotal">${subtotal}</td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		            </tr>
		            <tr style='height:39px;'>
		                <td class="s24" style="${styles['.s24']} ${styles.td}" dir="ltr">HOURS - Holiday
		                    <br><span style="font-weight:normal;">(where time and a half applies)</span>
		                </td>
		                <td class="s25" style="${styles['.s125']} ${styles.td}" dir="ltr" colspan="8">0.00</td>
		            </tr>
		            <tr style='height:40px;'>
		                <td class="s24" style="${styles['.s24']} ${styles.td}"  dir="ltr">HOLIDAY
		                    <br>COMPENSATION RATE ($ / hour)</td>
		                <td class="s26" style="${styles['.s26']} ${styles.td}" colspan="8">$22.50</td>
		            </tr>
		            <tr style='height:26px;'>
		                <td class="s27" style="${styles['.s27']} ${styles.td}" dir="ltr">Subtotal =</td>
		                <td class="s22" style="${styles['.s22']} ${styles.td}" dir="ltr">0</td>
		                <td class="s28" style="${styles['.s28']} ${styles.td}" dir="ltr"></td>
		                <td class="s28" style="${styles['.s28']} ${styles.td}" dir="ltr"></td>
		                <td class="s28" style="${styles['.s28']} ${styles.td}" dir="ltr"></td>
		                <td class="s28" style="${styles['.s28']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		                <td class="s23" style="${styles['.s23']} ${styles.td}" dir="ltr"></td>
		            </tr>
		            <tr style='height:38px;'>
		                <td class="s29" style="${styles['.s29']} ${styles.td}" dir="ltr"> $ TOTAL =</td>
		                <td class="s30" style="${styles['.s30']} ${styles.td}" colspan="5" id="total-pay">${total}</td>
		                <td class="s31" style="${styles['.s31']} ${styles.td}" ></td>
		                <td class="s31" style="${styles['.s31']} ${styles.td}" ></td>
		                <td class="s31" style="${styles['.s31']} ${styles.td}" ></td>
		            </tr>
		            <tr style='height:40px;'>
		                <td class="s32" style="${styles['.s32']} ${styles.td}"  dir="ltr">Date</td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}"  dir="ltr">First Name</td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}" dir="ltr">Last Name</td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}" dir="ltr">Position</td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}" dir="ltr">Location</td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}" dir="ltr">Site</td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}" dir="ltr">Start Time</td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}" dir="ltr">End Time</td>
		                <td class="s12" style="${styles['.s12']} ${styles.td}" dir="ltr">Length</td>
		            </tr>
		            <div class="invoice-items">
		            	${items}
		            </div>
		        </tbody>
		    </table>

		`;

		return invoice;
	}


	let basic_info = [];
	let invoice_items = [];
	let advisor_name = '';

	// Main function to generate an invoice
	function run(){

		// First get basic info
		advisor_name = advisor_name === "YOUR NAME HERE" ? $("#timesheet .header h2").text() : advisor_name;

		// The invoice dates
		let dates = $("#timesheet .header h2 span").text();
		basic_info.push(dates);

		// The due date
		let tmp_date = new Date();
		let due_date = tmp_date.getDate() + "/" + tmp_date.getMonth() + "/" + tmp_date.getFullYear();
		basic_info.push(due_date);

		// Total hours worked
		let total_hours = $("#id-timesheet-total").attr('data-total');
		basic_info.push(total_hours);

		// Pay due
		basic_info.push(PAY_RATE*parseFloat(total_hours));
		basic_info.push(PAY_RATE*parseFloat(total_hours))

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
				i.date = item.find('.day-col strong').text() + item.find('.day-col span').text();
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
				basic_info.push(data.advisorName);
				basic_info.push(data.advisorEmail);
				basic_info.push(data.advisorAddress);

				$(".payroll-info-card section").click();
				$(".payperiod-dropdown ul div:eq(2)").click();
				setTimeout(function(){
					run();

					let invoice = create_invoice(basic_info, invoice_items);

					$("#timesheet .header").append('<a href="#" style="display:none" id="gen-invoice"> Generate Invoice</a>');
					$(document).on('click', "#gen-invoice", function(e){
						e.preventDefault();


						let a = document.createElement('a');
						let data_type = 'data:application/vnd.ms-excel';
						let invoice_div = document.getElementById('invoice-html');

						a.setAttribute('href', 'data:text/calendar,' + encodeURIComponent(invoice));
						a.setAttribute('download', 'codecademy_invoice.xls');

						a.click();
					});

					$("#gen-invoice").click();
				}, 500);
				
			}
		);

		
	}, 3000);

});
