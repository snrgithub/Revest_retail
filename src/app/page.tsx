"use client";
import {useState,useEffect} from "react"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';

const formFields : any = JSON.parse(`{
  "data": [
    {
    "id": 1,
    "name": "Full Name",
    "fieldType": "TEXT",
    
    "minLength": 1,
    "maxLength": 100,
    "defaultValue": "John Doe",
    "required": true
    },
    {
    "id": 2,
    "name": "Email",
    "fieldType": "TEXT",
    "minLength": 1,
    "maxLength": 50,
    "defaultValue": "hello@mail.com",
    "required": true
    },
    {
    "id": 6,
    "name": "Gender",
    "fieldType": "LIST",
    "defaultValue": "1",
    "required": true,
    "listOfValues1": [
    "Male",
    "Female",
    "Others"
    ]
    },
    
    {
    "id": 7,
    "name": "Love React?",
    "fieldType": "RADIO",
    
    "defaultValue": "1",
    "required": true,
    "listOfValues1": [
    "Yes",
    "No"
    ]
    }
    
    ]
  }`)

type FieldInfo = {
  defaultValue?: string;
  error:boolean;
  errorText:string;
  fieldType:string;
  id:number;
  maxLength?:number;
  minLength?:number;
  name:string;
  required:boolean;
  value:string;
  listOfValues1?:Array<string>;
}

export default function Home() {
  const [formData,setFormData] = useState<null | Array<FieldInfo>>(null)
  useEffect(()=>{
    resetForm()
  },[])
  const resetForm = () =>{
    let data : Array<FieldInfo> = formFields.data.map((field:FieldInfo)=>{
      const listOfValues1 : Array<string> = field.listOfValues1 || []
      let defaultValue = field.defaultValue || ""
      if(field.fieldType === "LIST" || field.fieldType === "RADIO"){
        return {...field,error:false,errorText:"",
          value:listOfValues1[parseInt(defaultValue) - 1] || ""
        }
      }
      return {...field,error:false,errorText:"",value:field.defaultValue || ""}
    })
    setFormData(data)
  }
  const handleSubmit = () =>{
    let isError : boolean = false
    let temp = (formData || []).map((field:FieldInfo)=>{
      const {fieldType,value,minLength,maxLength}  = field
      let error : boolean = false
      let errorText : string = ''
      if(fieldType === "TEXT"){
        if((value.length < (minLength || 0)) ||  (value.length > (maxLength || 0))){
          isError = true
          error = true
          errorText = "Invalid Text"
        }
      }
      if((fieldType === "RADIO" || fieldType === "LIST") ){
        if(!value){
          isError = true
          error = true
          errorText = "Please Select Value"
        }
      }
      return {...field,error,errorText}
    })
    setFormData(temp)
    if(!isError){
      console.log("submitted successfully")
      resetForm()
    }
  }
  const handleChange = (id:number,value:string) =>{
    setFormData(prev=>{
      return prev.map(field=>{
        if(field.id === id){
          return {...field,value}
        }
        return field
      })
    })
  }
  if(!formData)return null
  return (
    <main >
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        {formData.map((field:FieldInfo)=>{
          let {fieldType,id,listOfValues1,name,value,error,errorText} = field
          if(fieldType === "TEXT"){
            return (
              <div key={id} >
                <TextField
                  label={name}
                  value={value}
                  size="small"
                  error={error}
                  helperText={errorText}
                  onChange={e=>handleChange(id,e.target.value)}
                />
              </div>
            )
          }
          if(fieldType === "LIST" || fieldType === "RADIO"){
              return(
                <div  key={id}>
                  <FormControl error={error}>
                    <FormLabel id="demo-row-radio-buttons-group-label">{name}</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={value}
                      onChange={e=>handleChange(id,e.target.value)}
                    >
                      {(listOfValues1 || []).map((val:string)=>{
                        return(
                          <FormControlLabel key={val} value={val} control={<Radio />} label={val} />
                        )
                      })}
                      
                    </RadioGroup>
                    <FormHelperText>{errorText}</FormHelperText>
                  </FormControl>
                </div>
              )
          }
        })}
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </Box>
      
    </main>
  )
}
