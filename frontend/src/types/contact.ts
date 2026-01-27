// Define the shape of a contact once so I can use it everywhere
export interface Contact {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

// Define what the form needs to send to the server
export interface ContactFormData {
  name: string;
  phone: string;
  relation: string;
}