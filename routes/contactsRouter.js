import { Router } from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../models/contactsModel.js";

import { isValidId } from "../helpers/isValidId.js";

const contactsRouter = Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

export default contactsRouter;
