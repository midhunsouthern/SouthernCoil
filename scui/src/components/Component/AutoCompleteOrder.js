import * as React from 'react';
import axios from "axios";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import {getActiveOrderIds} from '../../constant/url';
function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function AutoCompleteOrder({access,onSearchOrderId}) {
    console.log(access);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const topFilms=[];
  const getOrderIds=async()=>{
    try {
        var bodyFormData = new FormData();
		bodyFormData.append("authId", access);

        const result=await axios({
			method: "post",
			url: getActiveOrderIds,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		});
        if(result.status==200){
            setOptions([...result.data]);
        }
    } catch (error) {
        throw new Error(error);
    }
  };
  const onOrderIdSelect=async(event,values)=>{
    try {
        onSearchOrderId(values);
    } catch (error) {
        throw new Error(error);
    }
  };
  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        getOrderIds();
        //setOptions([...topFilms]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.order_id === value.order_id}
      getOptionLabel={(option) => option.order_id}
      options={options}
      loading={loading}
      onChange={onOrderIdSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search By Order Id"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
