import { createContext, Dispatch, MutableRefObject, PropsWithChildren, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { TagDTO } from "../../aid-service/dtos/tag.dto";
import { APIBaseURL, getData } from "../api/base";
import { RoleDTO } from "../../auth/dtos/role.dto";
import { ICluster } from "../../user/interfaces/cluster";
import { IAidService } from "../../aid-service/interfaces/aid-service.interface";
import { IQueryResult } from "../interfaces/api-response";

export interface IInitContext {
    tagsRef: MutableRefObject<TagDTO[]>;
    rolesRef: MutableRefObject<RoleDTO[]>;
    clustersRef: MutableRefObject<ICluster[]>;
    aidServicesRef: MutableRefObject<IAidService[]>;
    setReLoadEntities: Dispatch<SetStateAction<boolean>>;
    
}

const initContext = createContext<IInitContext>({} as IInitContext);

export const InitContextProvider = ({children}: PropsWithChildren) => {
    const tagsRef = useRef<TagDTO[]>([]);
    const [reLoadEntities, setReLoadEntities] = useState(false);
    const rolesRef = useRef<RoleDTO[]>([]);
    const clustersRef = useRef<ICluster[]>([]);
    const aidServicesRef = useRef<IAidService[]>([]);
    const entitiesLoadCountRef = useRef<number>(0);

    const getTags = async () => {
        const res = await getData<TagDTO[]>(`${APIBaseURL}/aid-service/tag`);
        tagsRef.current = res;
    }
    const getAidServices = async () => {
        const res = await getData<IQueryResult<IAidService>>(`${APIBaseURL}/aid-service`);
        
        aidServicesRef.current = res.data;
    }

    const getClusters = async () => {
        const res = await getData<ICluster[]>(`${APIBaseURL}/user/cluster`);
        clustersRef.current = res;
    }

    const getRoles = async () => {
            const res = await getData<RoleDTO[]>(`${APIBaseURL}/auth/role`);
            rolesRef.current = res;
    }

    const loadInitEntities = () => {
        
        getTags().catch((err) => console.log("Error getting tags", err.message))
        getRoles().catch((error) => console.log("Error setting roles", (error as Error).message));
        getClusters().catch((error) => console.log("Error setting clusters", (error as Error).message));
        getAidServices().catch((error) => console.log("Error setting init aidService ", (error as Error).message));
        entitiesLoadCountRef.current += entitiesLoadCountRef.current;
    }
    useEffect(() => {
        loadInitEntities();
    }, [reLoadEntities])
    if(entitiesLoadCountRef.current === 0) {
        setTimeout(() => setReLoadEntities((prev) => (!prev)), 1000)
    }
    

    const initValues: IInitContext = {
        tagsRef,
        rolesRef,
        clustersRef,
        aidServicesRef,
        setReLoadEntities

    }

    return (
        <initContext.Provider value={initValues}>
            {children}
        </initContext.Provider>
    )

}

export const useIInitContextStore = () => useContext<IInitContext>(initContext);