import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactsModel.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const listContacts = async (_, res) => {
  const contacts = await Contact.find({}, "-createdAt -updatedAt");
  res.status(200).json(contacts);
};

export const getAllContacts = ctrlWrapper(listContacts);

const getContactById = async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (contact === null) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(contact);
};

export const getOneContact = ctrlWrapper(getContactById);

const removeContact = async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);

  if (contact === null) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(contact);
};

export const deleteContact = ctrlWrapper(removeContact);

const addContact = async (req, res) => {
  const newContact = await Contact.create(req.body);

  res.status(201).json(newContact);
};

export const createContact = ctrlWrapper(addContact);

const updateById = async (req, res) => {
  const { id } = req.params;

  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (result === null) throw HttpError(404, "Not found");

  const size = Object.keys(req.body).length;
  if (size === 0) {
    return { error: "Body must have at least one field" };
  }

  res.status(200).json(result);
};

export const updateContact = ctrlWrapper(updateById);

const updateFavoriteStatus = async (req, res) => {
  const { id } = req.params;

  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (result === null) throw HttpError(404, "Not found");

  res.status(200).json(result);
};

export const updateFavorite = ctrlWrapper(updateFavoriteStatus);
