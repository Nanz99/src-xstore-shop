import { Effect, Reducer } from 'umi'
import { getListContact } from '@/services/contact.service'

// Create interface ten ...Item chua du lieu
export interface ContactItem {
   id: number,
   name: string,
   phone: string,
   email: string,
   title: string,
   content: string,
   createdAt: Date
   updatedAt: Date,
}

// Create interface Mod elState chua Item
export interface ContactModelState {
   listContact?: ContactItem[] | [],
   total: 0,
}

//Create ModelType (set thuoc tinh cho Model)
interface ServicesModelType {
   namespace: string
   state: ContactModelState
   effects: {
      getAllContactModel: Effect,

   }
   reducers: {
      setAllContact: Reducer<ContactModelState>
      setTotalContact: Reducer<ContactModelState>
   }
}

const ContactModel: ServicesModelType = {
   namespace: 'contact',
   state: {
      listContact: [],
      total: 0,

   },
   effects: {
      *getAllContactModel({ payload }, { call, put }) {
         const result = yield call(getListContact, payload)
         if (result) {
            yield put({
               type: 'setAllContact',
               payload: result?.data?.services || [],
            })
            yield put({
               type: 'setTotalContact',
               payload: result?.data?.total,
            })

         }
      },
   },
   reducers: {
      setAllContact(state, { payload }): ContactModelState {
         return {
            total: 0,
            ...state,
            listContact: payload,
         }
      },
      setTotalContact(state, { payload }): any {
         return {
            listContact: [],
            ...state,
            total: payload,
         }
      }
   },
}
export default ContactModel
