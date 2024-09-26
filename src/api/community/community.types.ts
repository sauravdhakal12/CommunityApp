export interface NewCommunityFormType {
  name: string,
  description: string,
  paid: string,
  price: number | undefined,
};


export interface DbCommunityType extends NewCommunityFormType {
  id: string,
  ownerId: string,
};