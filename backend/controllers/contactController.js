const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async(req,res)=>{
    const contacts = await Contact.find({user_id:req.user_id});
    res.status(200);
    res.json(contacts);
});

const createContact = asyncHandler(async(req,res)=>{
    console.log("The body is :", req.body);
    const {name,email,phone} = req.body;
    if(!name || !email){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user_id,
    })
    res.status(201);
    res.json(contact);
});

const getContact = asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(201);
    res.json(contact);
});

const updateContact = asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if(contact.user_id.toString()!=req.user_id){
        res.status(403);
        throw new Error("user doesnot have permission to update other user contacts");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(201);
    res.json(updatedContact);
});

const deleteContact = asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if(contact.user_id.toString()!=req.user_id){
        res.status(403);
        throw new Error("user doesnot have permission to update other user contacts");
    }
    await Contact.deleteOne({_id:req.params.id});
    res.status(200).json({});
});

module.exports = {getContacts,createContact,getContact,updateContact,deleteContact};