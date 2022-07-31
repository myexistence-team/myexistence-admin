export async function checkEmailAvailability(firestore, email) {
  const existingUsers = await firestore
    .collection("users")
    .where("email", "==", email)
    .get()

  console.log(existingUsers.empty)
  
  return (existingUsers.empty)
}