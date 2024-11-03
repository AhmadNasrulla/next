// types/index.ts
export type Course = {
    name: string;
    price: number;
  };
  
  export type Student = {
    email: string;
    name: string;
    phone: string;
    courses: Course[];
    proofUrl: string;
    totalPrice:number;
    date: Date;
  };