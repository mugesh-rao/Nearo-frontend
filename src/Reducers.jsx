import { createReducer } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const intialState = {
  a: true,
  b: false,
  c: true,
  isAuthnticated: Cookies.get("isAuthnticated")
    ? JSON.parse(Cookies.get("isAuthnticated"))
    : false,
  dashAuthnticate: Cookies.get("dashAuthnticate")
    ? JSON.parse(Cookies.get("dashAuthnticate"))
    : false,
  listingAuthnticated: Cookies.get("listingAuthnticated")
    ? JSON.parse(Cookies.get("listingAuthnticated"))
    : false,
  pageAuth: true,
  personalData2: {},
  shopData: {},
};
console.log(intialState.dashAuthnticate);

export const Reducers = createReducer(intialState, {
  truer: (state) => {
    state.a = true;
  },
  falser: (state) => {
    state.a = false;
  },
  truelog: (state) => {
    state.b = false;
  },
  falselog: (state) => {
    state.b = true;
  },
  trueDash: (state) => {
    state.c = true;
  },
  falseDash: (state) => {
    state.c = false;
  },
  profileCompleted: (state) => {
    state.listingAuthnticated = true;
    Cookies.set("listingAuthnticated", true, { expires: 7 });
  },
  profileUncomplete: (state) => {
    state.listingAuthnticated = false;
    Cookies.set("listingAuthnticated", false, { expires: 7 });
  },

  signUp: (state) => {
    state.isAuthnticated = true;
    Cookies.set("isAuthnticated", true, { expires: 7 });
  },
  signOut: (state) => {
    state.isAuthnticated = false;
    Cookies.remove("isAuthnticated");
  },

  login: (state) => {
    state.dashAuthnticate = true;
    Cookies.set("dashAuthnticate", true, { expires: 7 });
  },
  logout: (state) => {
    state.dashAuthnticate = false;
    Cookies.remove("dashAuthnticate");
  },
  pageIn: (state) => {
    state.pageAuth = true;
    Cookies.set("pageAuth", true, { expires: 7 });
  },
  pageOut: (state) => {
    state.pageAuth = false;
    Cookies.remove("pageAuth");
  },
  storePersonalDetails: (state, action) => {
    state.personalData2 = action.payload;
  },
  storeShopDetails: (state, action) => {
    state.shopData = action.payload;
  },
});
