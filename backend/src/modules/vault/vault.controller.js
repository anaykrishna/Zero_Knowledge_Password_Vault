import * as vaultService from './vault.service.js';

export async function getVault(req, res){
  const { id: userId } = req.user;

  const entries = await vaultService.getAllForUser(userId);
  res.json(entries);
}

export async function savePassword(req, res){
  const { id: userId } = req.user;
  const { service, username, encrypted_password } = req.body;

  console.log("POST /vault body:", { service, username });

  await vaultService.save({
    userId,
    service,
    username,
    encrypted_password,
  });

  res.status(201).json({ message: "Password Saved" });
}

export async function deletePassword(req, res){
  const { id: userId } = req.user;
  const { id: entryId } = req.params;

  console.log(`Deleting entry ${entryId} for user ${userId}`);

  try {
    await vaultService.deleteEntry(userId, entryId);
    console.log("Password deleted successfully");
    res.json({ message: "Password deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(404).json({ error: "Password entry not found" });
  }
}

//Modify the password using the entryId and other db columns.
export async function updatePassword(req, res) {
  const { id: userId } = req.user;
  const { id: entryId} = req.params;
  const { service, username, encrypted_password } = req.body;   //better db checks and security

  console.log(`Updating password for user ${userId}`);

  try{
    await vaultService.updateEntry(userId, entryId, { service, username, encrypted_password });
    console.log("Password Modified Successfully");    //server side
    res.json({ message : "Password modified Successfully"});  //frontend
  }catch(err){
    console.log(err.message);
    res.status(404).json({ error : "Modify Error "});
  }
}