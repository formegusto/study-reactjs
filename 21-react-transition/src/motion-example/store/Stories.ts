export type Story = {
  id: number;
  text: string;
  image: string;
};

export const Stories: Story[] = [
  {
    id: 1,
    text: "Hello world",
    image:
      "https://images.unsplash.com/photo-1506824959579-0a01750f66de?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=100",
  },
  {
    id: 2,
    text: "Bye world",
    image:
      "https://images.unsplash.com/photo-1506824959579-0a01750f66de?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=100",
  },
];
