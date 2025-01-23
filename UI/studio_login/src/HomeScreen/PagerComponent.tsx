import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PagerComponentInterface {
  updateKey: (newKey:number)=>any
}

const HomePagination: React.FC<PagerComponentInterface> = (props) => {
  const [ page, setPage] = React.useState<number>(1);
  React.useEffect(()=>{
    props.updateKey(page);
  },[page])

  return (
    <Stack spacing={2}>
      <Pagination 
        count={10} 
        color="primary"
        page={page}
        onChange={(evt,page)=>setPage(page)} 
      />
    </Stack>
  );
}

export default HomePagination;