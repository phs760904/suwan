import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { Property } from '../types';

const PROPERTIES_COLLECTION = 'properties';

export function subscribeToProperties(
  isAdmin: boolean,
  onData: (properties: Property[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, PROPERTIES_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Property[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Property, 'id'>;
        if (isAdmin || data.isVisible !== false) {
          list.push({
            id: docSnap.id,
            ...data,
          } as Property);
        }
      });
      onData(list);
    },
    (error) => {
      console.error('Subscription error on properties:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, PROPERTIES_COLLECTION);
      } catch {
        // Handled
      }
    }
  );
}

export async function fetchProperties(isAdmin: boolean = false): Promise<Property[]> {
  try {
    const q = query(
      collection(db, PROPERTIES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    const list: Property[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as Omit<Property, 'id'>;
      if (isAdmin || data.isVisible !== false) {
        list.push({
          id: docSnap.id,
          ...data,
        } as Property);
      }
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PROPERTIES_COLLECTION);
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const docPath = `${PROPERTIES_COLLECTION}/${id}`;
  try {
    const snap = await getDoc(doc(db, PROPERTIES_COLLECTION, id));
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...snap.data(),
    } as Property;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

export async function createProperty(property: Omit<Property, 'id'>, customId?: string): Promise<string> {
  const id = customId || `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docPath = `${PROPERTIES_COLLECTION}/${id}`;
  try {
    const propertyData = {
      ...property,
      createdAt: property.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: property.viewCount || 0,
      isVisible: property.isVisible !== undefined ? property.isVisible : true,
      status: property.status || 'available',
    };
    await setDoc(doc(db, PROPERTIES_COLLECTION, id), propertyData);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<void> {
  const docPath = `${PROPERTIES_COLLECTION}/${id}`;
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, PROPERTIES_COLLECTION, id), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function deleteProperty(id: string): Promise<void> {
  const docPath = `${PROPERTIES_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, PROPERTIES_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
