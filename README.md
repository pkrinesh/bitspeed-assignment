## Why I am using `urlSearchParam` for state

- We don't have to pass state as props or no need to use global state. All the children are only have that from url
- On refresh we can preserve the state without storing to the local storage
- Can be shared to any one have the same flow

- When you click on node it will open edit panel but you see that input is focused which is achieve by `useImperativeHandle`.

# Steps

[ ] - Basic set up react with vite
[ ] - add tailwind and tanstack router
[ ] - shadcn
[ ] - reactflow
[ ] - zod
