import { db } from "../config/firebase";
const collectionName = "data";

//getting data
export const GetFirebaseData = (setTable) => {
  const array = [];
  let item;
  db.collection(collectionName)
    .get()
    .then((res_array) => {
      res_array.forEach((doc) => {
        item = doc.data();
        item.id = doc.id;
        array.push(item);
      });
      setTable(array);
    });
};
// add data
export const AddDataToFirebase = (data) => {
  db.collection(collectionName).add(data);
};

//deleting data
export const DeleteData = (id) => {
  db.collection(collectionName).doc(id).delete();
  GetFirebaseData();
};
