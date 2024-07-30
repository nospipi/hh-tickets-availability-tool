"use client"

import styled from "styled-components"
import { Formik } from "formik"
import * as Yup from "yup"
import { useState, useContext } from "react"
import { GlobalContext } from "@/app/ContextProvider"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import CachedIcon from "@mui/icons-material/Cached"
import { RotatingLines } from "react-loader-spinner"
import Radio from "@mui/material/Radio"
import Tooltip from "@mui/material/Tooltip"
import { useIsFetching } from "@tanstack/react-query"
import { DatePicker, DateRangePicker } from "rsuite"
//https://rsuitejs.com/components/date-range-picker/
import moment from "moment"
import _ from "lodash"
import "rsuite/dist/rsuite.min.css"
import places from "../../places.json"

//----------------------------------------------------------------

const NavBarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`
const TopBar = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  span {
    font-size: 14px;
    font-weight: 600;
  }
  @media (max-width: 350px) {
    span {
      font-size: 12px;
    }
  }
`

const MenuBar = styled.div`
  flex: 1;
  //background-color: #dadada;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-top: 1px solid #dadada;
  gap: 10px;
  position: relative;
`
const RadioWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 7px;
`

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  span {
    font-size: 11px;
  }
  .MuiSvgIcon-root {
    width: 17px;
  }
`

const DateInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  /* @media (min-width: 550px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  } */
  select {
    border: none;
    border-radius: 6px;
    background-color: #fff;
    font-size: 11px;
    padding: 3.6px;
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    //width according the page width
    //over 600px width 200px
    //under 600px width 190px
    @media (max-width: 600px) {
      width: 150px;
    }
    @media (max-width: 520px) {
      width: 130px;
    }
    @media (max-width: 500px) {
      width: 110px;
    }
    @media (max-width: 470px) {
      width: 100px;
    }
    @media (max-width: 440px) {
      width: 90px;
    }
    @media (max-width: 420px) {
      width: 80px;
    }

    option {
      font-size: 11px;
    }
  }
`

const Button = styled.button<{ $noSelection?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border: none;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0px 0px 5px #bebebe;
  color: #333;
  font-size: 11px;
  //font-weight: bold;
  color: ${({ $noSelection }) => ($noSelection ? "#ccc" : "#1e7229;")};
  padding: 4px 10px;
  /* transition: all 0.3s ease; */

  /* &:hover {
    box-shadow: 4px 4px 10px #bebebe, -4px -4px 10px #ffffff;
  } */

  ${({ $noSelection }) =>
    !$noSelection &&
    `&:active {
    box-shadow: none;
    }
  `}

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  opacity: ${({ $noSelection }) => ($noSelection ? 0.5 : 1)};
  cursor: ${({ $noSelection }) => ($noSelection ? "not-allowed" : "pointer")};
  //disable pointer events
  //pointer-events: ${({ $noSelection }) => ($noSelection ? "none" : "all")};
`

const Title = styled.h1`
  font-size: 12px;

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  //no wrap
  white-space: nowrap;
`

//----------------------------------------------------------------

const validationSchema = Yup.object().shape(
  {
    place: Yup.string().required("Please select a site"),
    singleDateInputControl: Yup.date()
      .nullable()
      .when("dateRangeInputControl", {
        is: (val: any) => !val || val.length === 0,
        then: () => Yup.date().required("Please select a date"),
        otherwise: () => Yup.date().nullable(),
      } as any),
    dateRangeInputControl: Yup.array()
      .of(Yup.date().nullable())
      .nullable()
      .when("singleDateInputControl", {
        is: (val: any) => !val,
        then: () =>
          Yup.array()
            .of(Yup.date().nullable())
            .required("Please select a date")
            .nullable(),
        otherwise: () => Yup.array().of(Yup.date().nullable()).nullable(),
      } as any),
  },
  [["singleDateInputControl", "dateRangeInputControl"]] //ciclyc dependency
) as any

const NavBar = () => {
  const [singleSelection, setSingleSelection] = useState(true)
  const { zoneDates, setZoneDates, triggerRefetch, setTriggerRefetch } =
    useContext(GlobalContext)

  const handleTriggerRefetch = () => {
    if (!zoneDates.length) {
      return
    }
    setTriggerRefetch(!triggerRefetch)
  }

  const isFetching = useIsFetching()

  return (
    <Formik
      validateOnMount
      enableReinitialize
      initialValues={{
        place: "",
        singleDateInputControl: null,
        dateRangeInputControl: null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm, validateForm }) => {
        if (values.singleDateInputControl) {
          const newDate = {
            placedate: moment(values.singleDateInputControl).format("YYYYMMDD"),
            place: values.place,
          }
          const newZoneDates = _.uniqBy(
            [...zoneDates, newDate],
            (item) => `${item.placedate}-${item.place}`
          )
          const sortedZoneDates = _.sortBy(newZoneDates, "placedate")
          //@ts-ignore
          setZoneDates(sortedZoneDates)

          resetForm()

          setTimeout(() => {
            validateForm()
          }, 50)
        }
        //@ts-ignore
        if (values.dateRangeInputControl?.length) {
          const allDatesWithinRange = []
          let currentDate = moment(values.dateRangeInputControl[0])
          const endDate = moment(values.dateRangeInputControl[1])
          while (currentDate <= endDate) {
            allDatesWithinRange.push(currentDate.format("YYYYMMDD"))
            currentDate = currentDate.add(1, "days")
          }

          const datesWithPlace = allDatesWithinRange.map((date: string) => ({
            placedate: date,
            place: values.place,
          }))

          const newZoneDates = _.uniqBy(
            [...zoneDates, ...datesWithPlace],
            (item) => `${item.placedate}-${item.place}`
          )
          const sortedZoneDates = _.sortBy(newZoneDates, "placedate")
          //@ts-ignore
          setZoneDates(sortedZoneDates)

          resetForm()

          setTimeout(() => {
            validateForm()
          }, 50)
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
        isSubmitting,
        validateForm,
      }) => {
        const itHasErrors = Object.keys(errors).length > 0

        return (
          <NavBarContainer>
            <TopBar>
              <ConfirmationNumberIcon
                fontSize="small"
                sx={{
                  transform: "rotate(125deg)",
                  color: "rgb(85 149 212)",
                }}
              />

              <Title>HH E-Tickets Availability Tool</Title>
              {isFetching ? (
                <RotatingLines
                  width="16"
                  strokeColor="black"
                  strokeWidth={"3"}
                />
              ) : (
                <CachedIcon
                  titleAccess="Refresh all"
                  onClick={handleTriggerRefetch}
                  fontSize="small"
                  sx={{
                    cursor: "pointer",
                  }}
                />
              )}
            </TopBar>
            <MenuBar>
              <RadioWrapper>
                <RadioContainer>
                  <span>Single date</span>
                  <Radio
                    title="Single date selection"
                    size="small"
                    checked={singleSelection}
                    onChange={async () => {
                      setSingleSelection(true)
                      await setFieldValue("dateRangeInputControl", null)
                    }}
                    sx={{
                      padding: 0,
                    }}
                  />
                </RadioContainer>
                <RadioContainer>
                  <span>Date range</span>
                  <Radio
                    title="Date range selection"
                    size="small"
                    checked={!singleSelection}
                    onChange={async () => {
                      setSingleSelection(false)
                      await setFieldValue("singleDateInputControl", null)
                    }}
                    sx={{
                      padding: 0,
                    }}
                  />
                </RadioContainer>
              </RadioWrapper>
              <DateInputContainer>
                <select
                  value={values.place}
                  onChange={async (e) =>
                    await setFieldValue("place", e.target.value)
                  }
                  title="Choose a site"
                >
                  <option value="">Select a site</option>
                  {places.map((place) => (
                    <option key={place.value} value={place.value}>
                      {place.label}
                    </option>
                  ))}
                </select>
                {singleSelection ? (
                  <DatePicker
                    format="dd.MM.yyyy"
                    size="xs"
                    placeholder="Date"
                    appearance="subtle"
                    placement="bottomEnd"
                    cleanable
                    oneTap
                    onClean={async () =>
                      await setFieldValue("singleDateInputControl", null)
                    }
                    value={values.singleDateInputControl}
                    renderValue={(date) => {
                      return moment(date).format("ddd D MMM, YY")
                    }}
                    onChange={async (date) => {
                      if (!date) {
                        return
                      }
                      await setFieldValue("singleDateInputControl", date)
                    }}
                  />
                ) : (
                  <DateRangePicker
                    format="dd.MM.yyyy"
                    size="xs"
                    placeholder="Date range"
                    appearance="subtle"
                    placement="bottomEnd"
                    showHeader={false}
                    onClean={async () =>
                      await setFieldValue("dateRangeInputControl", null)
                    }
                    character="-"
                    renderValue={([start, end]) => {
                      return `${moment(start).format(
                        "ddd D MMM, YY"
                      )} - ${moment(end).format("ddd D MMM, YY")}`
                    }}
                    value={values.dateRangeInputControl}
                    ranges={[
                      {
                        label: "Today",
                        value: [new Date(), new Date()],
                        //placement: "left",
                      },

                      {
                        label: "Next week",
                        value: [
                          moment().toDate(),
                          moment().add(7, "days").toDate(),
                        ],
                      },
                      {
                        label: "Next month",
                        value: [
                          moment().toDate(),
                          moment().add(1, "month").toDate(),
                        ],
                      },
                    ]}
                    onChange={async (dates: any) => {
                      if (!dates) {
                        return
                      }
                      await setFieldValue("dateRangeInputControl", dates)
                    }}
                  />
                )}
              </DateInputContainer>
              <Tooltip
                title="Please make a selection first"
                placement="bottom"
                disableHoverListener={!itHasErrors}
              >
                <Button
                  type="submit"
                  $noSelection={itHasErrors} // ⓘ styled components transient props
                  onClick={() => {
                    if (!itHasErrors) {
                      handleSubmit()
                    }
                  }}
                >
                  <span>Submit</span>
                  <CheckCircleIcon
                    sx={{
                      fontSize: "13px",
                    }}
                  />
                </Button>
              </Tooltip>
            </MenuBar>
          </NavBarContainer>
        )
      }}
    </Formik>
  )
}

export default NavBar
