import { LightningElement, api, track } from 'lwc';
import getUserData from "@salesforce/apex/ScoreCardTopper.getUserData";


const columns = [
    
    { label: 'Customer Name', fieldName: 'UserName',type:'text'},
    { label: 'Customer Code', fieldName: 'Picture',type:'image'},
    { label: 'Product', fieldName: 'UserSalesArea'},
    { label: 'Product category', fieldName: 'Score'}, 
    { label: 'Volume(Tons)', fieldName: 'UserEmail',},
    
];


export default class MonthlyScoreCardToppers extends LightningElement {

    @track columns = columns;
    @api recordId;
    @track data = [];
    today = new Date();
    @track year = new Date().getFullYear().toString();;
    @track month = this.today.toLocaleString('default', { month: 'short' });
    @track currentYear = this.today.getFullYear() % 100;
    @track Mon = this.month.toLocaleUpperCase();
    @track first = [];
    @track second = [];
    @track third = [];
    @track datatable = false;
    

    firstboolen = false;
    secondboolen = false;
    thirdboolen = false;
    

    @track confettiArray = [];
    containerClass = 'confetti-container';

    handleMonthChange(event) {
        console.log('Pre'+this.month);
        this.month = event.target.value;
        console.log('Aft'+this.month);
        this.connectedCallback();
    }
    handleyearChange(event){
        this.year = event.target.value;
        console.log('year'+this.year);
    }

    get YearValues(){
        
        const currentyear = new Date().getFullYear();

        return [
            { label: currentyear - 3, value: String(currentyear - 3) },
            { label: currentyear - 2, value: String(currentyear - 2) },
            { label: currentyear - 1, value: String(currentyear - 1) },
            { label: currentyear,     value: String(currentyear) },
            { label: currentyear + 1, value: String(currentyear + 1) },
            { label: currentyear + 2, value: String(currentyear + 2) },
        ];

    }

    get MonthValues() {
        return [
            { label: 'Jan', value: 'Jan' },
            { label: 'Feb', value: 'Feb' },
            { label: 'Mar', value: 'Mar' },
            { label: 'Apr', value: 'Apr' },
            { label: 'May', value: 'May' },
            { label: 'Jun', value: 'Jun' },
            { label: 'Jul', value: 'Jul' },
            { label: 'Aug', value: 'Aug' },
            { label: 'Sep', value: 'Sep' },
            { label: 'Oct', value: 'Oct' },
            { label: 'Nov', value: 'Nov' },
            { label: 'Dec', value: 'Dec' },
        ]
    }
    

    connectedCallback() {
        getUserData({month:this.month,year:this.year})
          .then((result) => {
            this.data = result;
            this.Mon = this.month.toLocaleUpperCase();
              this.getshortdata();
          })
          .catch((error) => {
            console.log("===>>Error during callout : " + JSON.stringify(error));
          });
          
}

getshortdata(){
    
   
     this.data = this.data.map((row,index) => {
         return{...row,Id:index+1}
     })

     this.data = this.data.sort((a,b)=> b.Score - a.Score);
     console.log('Short Data = '+JSON.stringify(this.data));
    
    this.data = this.data.map((row,index) => {
        return{...row,Rscore:Math.round(row.Score),Index:index+1}
    })
    console.log('Short score'+JSON.stringify(this.data));
    this.first = this.data.filter(value=> value.Index == 1);
    this.second = this.data.filter(value=> value.Index == 2);
    this.third = this.data.filter(value=> value.Index == 3);
    
     console.log('first'+JSON.stringify(this.first));
     if(this.first != ''){
         this.firstboolen= true;
        }
     if(this.second != ''){
         this.secondboolen= true;
        }
     if(this.third != ''){
         this.thirdboolen= true;
        }
     if(this.data != ''){
        this.datatable = true;
     }else{
        this.datatable = false;
     }
    }
 
    exportContactData(){
        if(this.data.length > 0){
        //alert('length>>>>>>>>>>>>>>>'+ this.displayrec.length)

        // Prepare a html table
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers

        doc += '<tr>';

        doc += '<th>'+ 'Rank' +'</th>';
        doc += '<th>'+ 'KAM' +'</th>';
        doc += '<th>'+ 'Sales Area' +'</th>';
        doc += '<th>'+ 'Area Type' +'</th>';
        doc += '<th>'+ 'Score' +'</th>';
        doc += '<th>'+ 'Email' +'</th>';

        doc += '</tr>';

        // Add the data rows
        this.data.forEach(record => {
            doc += '<tr>';
            doc += '<th>'+record.Index+'</th>'; 
            doc += '<th>'+record.UserName+'</th>'; 
            doc += '<th>'+record.UserSalesArea+'</th>';
            doc += '<th>'+record.UserAreaType+'</th>';
            doc += '<th>'+record.Rscore+'</th>';
            doc += '<th>'+record.UserEmail+'</th>'; 
            doc += '</tr>';
        });
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Key Account Billings.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
}
  

}
