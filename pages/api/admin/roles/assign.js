import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req,res){
  if(!(await adminGuard(req,res))) return;

  if(req.method!=="PUT") return res.status(405).json({ok:false});

  const {roleId,permissions}=req.body||{};
  if(!roleId||!Array.isArray(permissions)) return res.status(400).json({ok:false});

  const db=(await clientPromise).db();
  await db.collection("roles").updateOne({_id:roleId},{$set:{permissions}});
  res.json({ok:true});
}
