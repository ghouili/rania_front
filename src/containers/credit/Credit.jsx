import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";

import { BsFileEarmarkPlus } from "react-icons/bs";
import { path } from "../../utils/Variables";
import InputField from "../../components/inputField/InputField";
import swal from "sweetalert";

const TABS = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "EnCours",
    value: "En cours",
  },
  {
    label: "Accepte",
    value: "Acceptee",
  },
  {
    label: "Refusee",
    value: "Refusee",
  },
];

const TABLE_HEAD = ["Pack", "PDV", "duree", "etat", "date", ""];

function PMT(ir, np, pv) {
  var pmt, pvif;
  if (ir == 0) pmt = -pv / np;
  pvif = Math.pow(1 + ir, np);
  if (ir != 0) pmt = (-ir * pv * pvif) / (pvif - 1);
  return pmt;
}

const Credit = () => {
  const cookies = new Cookies();
  let user = cookies.get("user");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterData, setfilterData] = useState([]);
  const [masterData, setmasterData] = useState([]);
  const [pdvs, setPdvs] = useState([]);
  const [packs, setPacks] = useState([]);
  const [packCredits, setPackCredits] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [autre, setAutre] = useState(0);
  const [fraisDoc, setFraisDoc] = useState(0);
  const [id, setId] = useState(null);
  const [montant_ech, setMontant_ech] = useState(0);
  const [formValues, setFormValues] = useState({
    montant: 0,
    duree: 0,
    grasse: 0,
    rembource: "Mensuelle",
    packid: "",
    offreid: "",
    userid: user?._id,
  });
  const [minMant, setMinMant] = useState(0);
  const [maxMant, setMaxMant] = useState(0);
  const [errors, setErrors] = useState({
    montant: null,
    montant_ech: null,
    duree: null,
    grasse: null,
    rembource: null,
  });

  const handleOpenAccept = (id) => {
    setOpenAccept(!openAccept);
    setFraisDoc(0);
    setMontant_ech(0);
    setAutre(0);
    if (openAccept) {
      setId(null);
      return;
    }
    handleCalculate(id);
  };

  const handleOpen = () => {
    setOpen(!open);
    setMinMant(0);
    setMaxMant(0);
    setFormValues({
      montant: 0,
      montant_ech: 0,
      duree: 0,
      grasse: 0,
      rembource: "Mensuelle",
      date: "",
      packid: "",
      offreid: "",
      userid: user?._id,
    });
  };

  const searchFilter = (text) => {
    if (text === "All") {
      setfilterData(masterData);
      setSearch(text);
      return;
    }
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = Object.values(item).join(" ").toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setfilterData(newData);
      setSearch(text);
    } else {
      setfilterData(masterData);
      setSearch(text);
    }
  };

  const fetchPdvData = async () => {
    const result = await axios.get(`${path}user/pdvs`);

    // console.log(result.data.data);
    setPdvs(result.data.data);
  };

  const fetchPackData = async () => {
    const result = await axios.get(`${path}service`);

    console.log(result.data.data);
    setPacks(result.data.data);
  };

  const fetchPackCreditsData = async (id) => {
    const result = await axios.get(`${path}offre/pack/${id}`);

    setPackCredits(result.data.data);
  };

  const fetchData = async () => {
    const result = await axios.get(`${path}credit`);

    setmasterData(result.data.data);
    setfilterData(result.data.data);
  };

  useEffect(() => {
    fetchPdvData();
    fetchPackData();
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    if (e.target.name === "montant") {
      if (e.target.value < minMant || e.target.value > maxMant) {
        setErrors({
          ...errors,
          montant: "Montant de finnencssement must be correct",
        });
      } else {
        setErrors({
          ...errors,
          montant: null,
        });
      }
    }
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    // console.log("calculate :");
    // handleCalculate();

    try {
      let url, result;
      if (formValues._id) {
        url = `${path}credit/${formValues._id}`;
        result = await axios.put(url, formValues);
      } else {
        url = `${path}credit/add`;
        result = await axios.post(url, formValues);
      }
      // console.log(result);
      if (result.data.success === true) {
        fetchData();
        swal("Success!", result.data.message, "success");
      } else {
        return swal("Error!", result.data.message, "error");
      }
    } catch (error) {
      console.error(error);
      return swal(
        "Error!",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  const Refuse = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to Refuse this credit?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      const result = await axios.put(
        `http://localhost:5000/credit/etat/${id}`,
        { etat: "Refusee" }
      );

      if (result.data.success) {
        swal("Success!", result.data.message, "success");
        fetchData();
      } else {
        return swal("Error!", result.adta.message, "error");
      }
    }
  };

  const Accept = async (e) => {
    e.preventDefault();
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to Refuse this credit?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      const result = await axios.put(
        `http://localhost:5000/credit/etat/${id}`,
        { etat: "Acceptee", montant_ech: parseInt(montant_ech) + parseInt(autre) + parseInt(fraisDoc) }
      );

      if (result.data.success) {
        swal("Success!", result.data.message, "success");
        fetchData();
      } else {
        return swal("Error!", result.adta.message, "error");
      }
    }
  };

  const handleCalculate = async (_id) => {
    //const amount=setAmount.value;
    // console.log(formValues);
    // const PMTV = PMT(0.0025 / 12, 12 - 1, -1 * 1000);
    console.log(id);
    let credit;
    const result = await axios.get(`${path}credit/${_id}`);

    credit = result.data.data;
    const PMTV = PMT(
      0.0025 / 12,
      credit.duree - credit.grasse,
      -1 * credit.montant
    );

    if (credit.rembource === "Mensuelle") {
      setMontant_ech(Math.round(PMTV));
      // console.log(Math.round(PMTV));
    } else {
      setMontant_ech(Math.round(PMTV * 3));
      // console.log(Math.round(PMTV * 3));
    }
  };

  return (
    <div className="w-full mt-4 ">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Members list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all members
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={() => setSearch("")}
              >
                view all
              </Button>
              <Button
                className="flex items-center gap-3"
                color="blue"
                size="sm"
                onClick={handleOpen}
              >
                <BsFileEarmarkPlus className="h-4 w-4" /> Demande Credit
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value="All" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => {
                      searchFilter(value);
                      // console.log(value);
                    }}
                  >
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72">
              <Input
                label="Search"
                value={search}
                onChange={(e) => searchFilter(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterData
                .slice(0)
                .reverse()
                .map(
                  (
                    {
                      _id,
                      montant,
                      montant_ech,
                      duree,
                      grasse,
                      payed,
                      etat,
                      rembource,
                      date,
                      packid,
                      userid,
                    },
                    index
                  ) => {
                    let pack = packs.filter((item) => item._id === packid);
                    let pdv = pdvs.filter((item) => item._id === userid);
                    // console.log(pack);
                    // console.log(pdv);
                    const isLast = index === filterData.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={_id}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              <Link
                                to={`/offres/${packid}`}
                                className="text-blue-700 hover:text-blue-900 underline "
                              >
                                {pack[0]?.nom}
                              </Link>{" "}
                              (<b>{montant}</b> DT) / <b>{montant_ech}</b> DT
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              <Link
                                to={`/offres/${packid}`}
                                className="text-blue-700 hover:text-blue-900 underline "
                              >
                                {pdv[0]?.name}
                              </Link>
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              <b>{duree}</b> par <b>{rembource}</b> apres{" "}
                              <b>{grasse}</b> mois
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              color={
                                etat === "Acceptee"
                                  ? "green"
                                  : etat === "Refusee"
                                  ? "red"
                                  : "blue-gray"
                              }
                              value={etat}
                              // color="blue-gray"
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {date}
                          </Typography>
                        </td>
                        <td className={classes}>
                          {etat === "Refusee" ? null : (
                            <Tooltip content="Refuse Credit">
                              <IconButton
                                variant="text"
                                color="red"
                                onClick={() => Refuse(_id)}
                              >
                                <XMarkIcon className="h-5 w-5 text-red-900" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {etat === "Acceptee" ? null : (
                            <Tooltip content="Accept Credit">
                              <IconButton
                                variant="text"
                                color="green"
                                onClick={() => {
                                  console.log(_id);
                                  setId(_id);
                                  handleOpenAccept(_id);
                                }}
                              >
                                <CheckIcon className="h-5 w-5 text-green-900 " />
                              </IconButton>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" size="sm">
              Previous
            </Button>
            <Button variant="outlined" color="blue-gray" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Fragment>
        <Dialog
          open={open}
          handler={handleOpen}
          size="lg"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <DialogHeader>Demande de Credit</DialogHeader>
          <form onSubmit={handleSubmit}>
            <DialogBody divider>
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <label
                    htmlFor="Packid"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Pack:
                  </label>
                  <Select
                    id="Packid"
                    value={formValues.packid}
                    onChange={(value) => {
                      // console.log(e);
                      fetchPackCreditsData(value);
                      setFormValues({
                        ...formValues,
                        packid: value,
                      });
                    }}
                    label="Select a Pack"
                  >
                    {packs
                      .slice(0)
                      .reverse()
                      .map(({ _id, nom }) => (
                        <Option key={_id} value={_id}>
                          {nom}
                        </Option>
                      ))}
                  </Select>
                </div>
                <div className="">
                  <label
                    htmlFor="crditid"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Credit:
                  </label>
                  <Select
                    id="crditid"
                    value={formValues.offreid}
                    onChange={(value) => {
                      setMinMant(value.montant_min);
                      setMaxMant(value.montant_max);
                      setFormValues({
                        ...formValues,
                        offreid: value._id,
                      });
                    }}
                    label="Select a Credit"
                  >
                    {packCredits
                      .slice(0)
                      .reverse()
                      .map(({ _id, title, montant_min, montant_max }) => (
                        <Option
                          key={_id}
                          value={{ _id, montant_min, montant_max }}
                        >
                          {title} : [ {montant_min} -- {montant_max}]
                        </Option>
                      ))}
                  </Select>
                </div>

                <InputField
                  type="number"
                  label="Montant :"
                  name="montant"
                  placeholder="Montant de credit"
                  value={formValues.montant}
                  onChange={handleInputChange}
                  error={errors.montant}
                />
                <InputField
                  type="number"
                  label="Duree par mois:"
                  name="duree"
                  placeholder="Duree de payement"
                  value={formValues.duree}
                  onChange={handleInputChange}
                />
                <InputField
                  type="number"
                  label="Period de grasse par mois:"
                  name="grasse"
                  placeholder="Period de grasse par mois"
                  value={formValues.grasse}
                  onChange={handleInputChange}
                />
                <div className="">
                  <label
                    htmlFor="rembourceid"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Type De rembourcement:
                  </label>
                  <Select
                    id="rembourceid"
                    value={formValues.rembource}
                    onChange={(value) => {
                      setFormValues({
                        ...formValues,
                        rembource: value,
                      });
                    }}
                    label="Select Type De Rembourcement"
                  >
                    <Option value="Mensuelle">Mensuelle</Option>
                    <Option value="Trimestrielle">Trimestrielle</Option>
                  </Select>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={handleOpen}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <Button variant="gradient" color="green" type="submit">
                <span>Confirm</span>
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </Fragment>

      <Fragment>
        <Dialog open={openAccept} handler={handleOpenAccept}>
          <div className="flex items-center justify-between">
            <DialogHeader>Accept this Credit</DialogHeader>
            <XMarkIcon className="mr-3 h-5 w-5" onClick={handleOpenAccept} />
          </div>
          <form onSubmit={Accept}>
            <DialogBody divider>
              <div className="grid gap-6">
                <Input
                  label="Mantant decheance"
                  value={montant_ech}
                  onChange={(e) => setMontant_ech(e.target.value)}
                />
                <Input
                  label="Frais de dossier"
                  value={fraisDoc}
                  onChange={(e) => setFraisDoc(e.target.value)}
                />
                <Input
                  label="Autre"
                  value={autre}
                  onChange={(e) => setAutre(e.target.value)}
                />
              </div>
            </DialogBody>
            <DialogFooter className="space-x-2">
              <Button variant="outlined" color="red" onClick={handleOpenAccept}>
                close
              </Button>
              <Button variant="gradient" color="green" type="submit">
                Accept
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </Fragment>
    </div>
  );
};

export default Credit;
