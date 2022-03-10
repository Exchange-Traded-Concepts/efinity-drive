export default class States{

 static async state_hash() {
   const states = {
     'NA': 'N/A',
     'AL': 'Alabama',
     'AK': 'Alaska',
     'AS': 'American Samoa',
     'AZ': 'Arizona',
     'AR': 'Arkansas',
     'CA': 'California',
     'CO': 'Colorado',
     'CT': 'Connecticut',
     'DE': 'Delaware',
     'DC': 'District Of Columbia',
     'FM': 'Federated States Of Micronesia',
     'FL': 'Florida',
     'GA': 'Georgia',
     'GU': 'Guam',
     'HI': 'Hawaii',
     'ID': 'Idaho',
     'IL': 'Illinois',
     'IN': 'Indiana',
     'IA': 'Iowa',
     'KS': 'Kansas',
     'KY': 'Kentucky',
     'LA': 'Louisiana',
     'ME': 'Maine',
     'MH': 'Marshall Islands',
     'MD': 'Maryland',
     'MA': 'Massachusetts',
     'MI': 'Michigan',
     'MN': 'Minnesota',
     'MS': 'Mississippi',
     'MO': 'Missouri',
     'MT': 'Montana',
     'NE': 'Nebraska',
     'NV': 'Nevada',
     'NH': 'New Hampshire',
     'NJ': 'New Jersey',
     'NM': 'New Mexico',
     'NY': 'New York',
     'NC': 'North Carolina',
     'ND': 'North Dakota',
     'MP': 'Northern Mariana Islands',
     'OH': 'Ohio',
     'OK': 'Oklahoma',
     'OR': 'Oregon',
     'PA': 'Pennsylvania',
     'PR': 'Puerto Rico',
     'RI': 'Rhode Island',
     'SC': 'South Carolina',
     'SD': 'South Dakota',
     'TN': 'Tennessee',
     'TX': 'Texas',
     'UT': 'Utah',
     'VT': 'Vermont',
     'VI': 'Virgin Islands',
     'VA': 'Virginia',
     'WA': 'Washington',
     'WV': 'West Virginia',
     'WI': 'Wisconsin',
     'WY': 'Wyoming'
   }
   return states
 }

 static async months_list(){
   const months ={
     1: 'January',
     2: 'February',
     3: 'March',
     4: 'April',
     5: 'May',
     6: 'June',
     7: 'July',
     8: 'August',
     9: 'September',
     10: 'October',
     11: 'November',
     12: 'December'
   }
   return months
 }

};

module.exports = States
