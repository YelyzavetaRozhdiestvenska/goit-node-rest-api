import { promises as fs } from "fs";
import path from "path";
import { v4 } from "uuid";

const contactsPath = path.resolve("./db/contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();

    return contacts.find((item) => item.id === contactId) || null;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    }
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
  } catch (error) {
    console.log(error);
  }
}
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: v4(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.log(error);
  }
}

async function updateContact(id, contactData) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);

    if (index === -1) {
      return null;
    }

    const existingContact = contacts[index];
    const updatedContact = { ...existingContact, ...contactData };

    const updateContactsList = [
      ...contacts.slice(0, index),
      updatedContact,
      ...contacts.slice(index + 1),
    ];

    await fs.writeFile(contactsPath, JSON.stringify(updateContactsList, null, 2), {
      encoding: "utf-8",
    });

    return updateContactsList.find((item) => item.id === id);
  } catch (error) {
    console.log(error);
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
