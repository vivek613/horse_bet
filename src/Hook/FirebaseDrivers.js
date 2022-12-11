import { db } from "../config/firebase";
const collectionName = "HorseData";

//getting data
export const GetFirebaseData = () => {
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
      // setUploadedData(array);
    });
};
// add data
export const AddDataToFirebase = (data) =>
  db.collection(collectionName).add(data);

//deleting data
export const DeleteData = ({ id }) =>
  db.collection(collectionName).doc(id).delete();
