import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { Inquiry } from '../types';

const INQUIRIES_COLLECTION = 'inquiries';

export function subscribeToInquiries(
  onData: (inquiries: Inquiry[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, INQUIRIES_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Inquiry[] = [];
      snapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as Inquiry);
      });
      onData(list);
    },
    (error) => {
      console.error('Subscription error on inquiries:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, INQUIRIES_COLLECTION);
      } catch {
        // Handled
      }
    }
  );
}

export async function createInquiry(data: Omit<Inquiry, 'id'>): Promise<string> {
  const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docPath = `${INQUIRIES_COLLECTION}/${id}`;
  try {
    const payload = {
      ...data,
      status: data.status || 'pending',
      createdAt: data.createdAt || new Date().toISOString(),
    };
    await setDoc(doc(db, INQUIRIES_COLLECTION, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function updateInquiryStatus(id: string, status: 'pending' | 'completed'): Promise<void> {
  const docPath = `${INQUIRIES_COLLECTION}/${id}`;
  try {
    await updateDoc(doc(db, INQUIRIES_COLLECTION, id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  const docPath = `${INQUIRIES_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, INQUIRIES_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
