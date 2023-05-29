import React , { Fragment, useState }from 'react'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Accordion,
  AccordionHeader,
  AccordionBody,

 
} from "@material-tailwind/react";

const Simulateur = () => {

  const [open, setOpen] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(!openDialog);


  return (
    <div className="w-full flex flex-col items-center py-4  ">
        <h1 className='text-5xl font-bold text-blue-900 my-20'>Simulateur de crédit </h1>
        <div className=" flex flex-row gap-20 ">
        <form className="w-full  " action="">
             <div class="grid gap-4 mb-4 sm:grid-cols-2 ">
             <div className="flex flex-col gap-3">
              <label htmlFor="nomID" className="text-2xl font-medium">
              Montant du financement
              </label>
              
            </div>
            <div className="flex flex-col gap-3">
            
              <input
                type="montant"
                name="montant"
                id="MontantID"
                placeholder="100... Dt"
                className="border border-gray-500  bg-white px-2 py-4 "
              />
            </div>
            <div className="flex flex-col gap-3">
             
                  
              
                <label for="steps-range" className=" text-2xl font-medium block mb-2  text-gray-900 dark:text-black">Durée (mois)</label>
                <input id="steps-range" type="range" min="12" max="18" value="2.5" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>


              
            </div> 
            <div className="flex flex-col gap-3">
             
              <input
                type="durée"
                name="durée"
                id="DuréelID"
                placeholder="12(mois)"
                className="border border-gray-500  bg-white px-2 py-4"
              />
            </div>
            <div className="flex flex-col gap-3">
              
            <label for="steps-range" className=" text-2xl font-medium block mb-2  text-gray-900 dark:text-black">Taux d'intéret (mois)</label>
            <input id="steps-range" type="range" min="12" max="18" value="2.5" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>

              
            </div>
            <div className="flex flex-col gap-3">
             
              <input
                type="taux"
                name="taux"
                id="TaixID"
                placeholder="Votre Adresse..."
                className="border border-gray-500  bg-white px-2 py-4"
              />
            </div>

            <label htmlFor="nomID" className="text-2xl font-medium">
              Remboursement
            </label>

            <div className="flex flex-col gap-3">
             
              
            
              <div class="flex items-center mb-4">
                  <input id="default-radio-1" type="radio" value="" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                  <label for="default-radio-1" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mensuel</label>
              </div>
              <div class="flex items-center">
                  <input checked id="default-radio-2" type="radio" value="" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                  <label for="default-radio-2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Trimestriel</label>
              </div>



            </div>

            </div>

            <Fragment>
          <Button className="border border-gray-500 bgb italic font-medium text-center bg-blue-950 px-2 py-4 text-white text-lg " onClick={handleOpenDialog} variant="gradient">
            Open Dialog
          </Button>
          <Dialog open={openDialog} handler={handleOpenDialog}>
            <DialogHeader>Its a simple dialog.</DialogHeader>
            <DialogBody divider>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus ad
              reprehenderit omnis perspiciatis aut odit! Unde architecto
              perspiciatis, dolorum dolorem iure quia saepe autem accusamus eum
              praesentium magni corrupti explicabo!
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={handleOpenDialog}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <Button variant="gradient" color="green" onClick={handleOpenDialog}>
                <span>Confirm</span>
              </Button>
            </DialogFooter>
          </Dialog>
        </Fragment>
      
             
          </form>
        </div>
    </div>
  )
}

export default Simulateur