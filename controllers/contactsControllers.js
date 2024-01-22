import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await contactsService.getContactById(id);

    if (contact === null) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await contactsService.removeContact(id);

    if (contact === null) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    console.log(name, email, phone);

    const newContact = await contactsService.addContact(name, email, phone);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const size = Object.keys(req.body).length;
    if (size === 0) throw HttpError(400, "Body must have at least one field");

    const { id } = req.params;

    const result = await contactsService.updateContact(id, req.body);

    if (result === null) throw HttpError(404, "Not found");

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
