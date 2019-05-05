import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import firebase from "../../firebaseConfig";
import { PaddingRow } from "../authentication/LoginForm";
import Input from "../general/Input";
import Button from "../general/Button";
import { ListHeader, ListRow } from "../employees/EmployeeList";
import LoadingIcon from "../../Icons/LoadingIcon";
import { FlexContainer, Order } from "../companies/CompanyList";
import {Activity} from "../../types/activityTypes";

type Column = "name";

interface Sort {
  column: Column;
  order: Order;
}

interface ActivitiesListProps {
  selectActivity: (activityId: string) => void;
}

const ActivitiesList: FunctionComponent<ActivitiesListProps> = props => {
  const [searchValue, setSearchValue] = useState("");
  const initialSortState: Sort = {
    column: "name",
    order: "asc"
  };
  const [sortMethod, setSortMethod] = useState(initialSortState);
  const [loading, setLoading] = useState(false);
  const initialActivityListState: Activity[] = [];
  const [activityList, setActivityList] = useState(initialActivityListState);
  const [clonedActivityList, setClonedActivityList] = useState(
    initialActivityListState
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { target } = event;
    setSearchValue(target.value);
    if (target.value === "") {
      setActivityList(clonedActivityList);
      return;
    }
    let searchList: Activity[];
    searchList = clonedActivityList.filter(
      activity =>
        activity.name.toLowerCase().indexOf(target.value.toLowerCase()) > -1
    );
    setActivityList(searchList);
  };

  const getActivities = async (): Promise<void> => {
    setLoading(true);
    try {
      const db = firebase.firestore();
      await db.collection("activities").onSnapshot(querySnapShot => {
        const activityData: Activity[] = [];
        querySnapShot.forEach(doc => {
          const activity: Activity = {
            id: doc.id,
            name: doc.data().name
          };
          activityData.push(activity);
        });
        setActivityList(activityData);
        setClonedActivityList(activityData);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getActivities();
    return () => {
      const db = firebase.firestore();
      const unsubscribe = db.collection("activities").onSnapshot(() => {});
      unsubscribe();
    };
  }, []);

  const sortData = (sortMethod: Sort) => {
    setSortMethod(sortMethod);
    if (sortMethod.column === "name") {
      if (sortMethod.order === "asc") {
        sortAsc(sortMethod.column);
      } else {
        sortDesc(sortMethod.column);
      }
    }
  };

  const sortAsc = (column: Column): void => {
    const listToSort: Activity[] = JSON.parse(JSON.stringify(activityList));
    listToSort.sort((a: Activity, b: Activity): number => {
      const propA = a[column].toLowerCase();
      const propB = b[column].toLowerCase();
      if (propA < propB) {
        return -1;
      }
      if (propA > propB) {
        return 1;
      }
      return 0;
    });
    setActivityList(listToSort);
    setClonedActivityList(listToSort);
  };

  const sortDesc = (column: Column): void => {
    const listToSort: Activity[] = JSON.parse(JSON.stringify(activityList));
    listToSort.sort((a: Activity, b: Activity): number => {
      const propA = a[column].toLowerCase();
      const propB = b[column].toLowerCase();
      if (propB < propA) {
        return -1;
      }
      if (propB > propA) {
        return 1;
      }
      return 0;
    });
    setActivityList(listToSort);
    setClonedActivityList(listToSort);
  };

  return (
    <Fragment>
      <PaddingRow>
        <FlexContainer>
          <Input
            labelValue="Search"
            type="text"
            name="search"
            onFormChange={handleSearchChange}
            width="300px"
            value={searchValue}
          />
          <Button
            type="button"
            text="Add activity"
            onSubmit={() => props.selectActivity("")}
          />
        </FlexContainer>
      </PaddingRow>
      <ListHeader>
        <span
          onClick={() =>
            sortData({
              column: "name",
              order: sortMethod.order === "asc" ? "desc" : "asc"
            })
          }
        >
          Name
        </span>
      </ListHeader>
      {activityList.length > 0 && !loading ? (
        activityList.map((activity: Activity) => {
          return (
            <ListRow
              key={activity.id}
              onClick={() => props.selectActivity(activity.id)}
            >
              <span>{activity.name}</span>
            </ListRow>
          );
        })
      ) : loading ? (
        <ListRow>
          <LoadingIcon
            position="relative"
            left="0"
            height="30px"
            width="30px"
            color="#393e41"
          />
        </ListRow>
      ) : (
        <ListRow>
          <span>No activites.</span>
        </ListRow>
      )}
    </Fragment>
  );
};

export default ActivitiesList;
