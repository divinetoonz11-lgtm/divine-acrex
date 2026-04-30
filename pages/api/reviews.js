export default function handler(req,res){

  res.json([

    {
      name:"Resident",
      rating:4,
      text:"Good connectivity and nearby facilities."
    },

    {
      name:"Owner",
      rating:3,
      text:"Property prices are rising in this area."
    },

    {
      name:"Tenant",
      rating:4,
      text:"Public transport and schools are easily accessible."
    }

  ]);

}