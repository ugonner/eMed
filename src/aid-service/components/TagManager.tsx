import { LegacyRef, useRef, useState } from "react";
import { TagDTO } from "../dtos/tag.dto";
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import { pinSharp } from "ionicons/icons";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";
import {
  ISelectOption,
  MultiSelector,
} from "../../shared/components/form/MultiSelector";

export interface ITagManagerProps {
  initTags: TagDTO[];
  onCompletion: (tags: TagDTO[]) => void;
  label: string;
}

export const TagManager = ({
  initTags,
  onCompletion,
  label,
}: ITagManagerProps) => {
  const { tagsRef, setReLoadEntities } = useIInitContextStore();

  const tagsSearchInputRef = useRef<HTMLIonInputElement>();

  const [tagDtos, setTagDtos] = useState<TagDTO[]>(initTags);
  const [openTagsSearchList, setOpenTagsSearchList] = useState(false);
  const [tagsSearchList, setTagsSearchList] = useState<TagDTO[]>([]);
  const [openTagsSelectorOverlay, setOpenTagsSelectorOverlay] = useState(false);

  return (
    <div>
      <IonItem
        role="button"
        onClick={() => setOpenTagsSelectorOverlay(!openTagsSelectorOverlay)}
      >
        <IonAvatar>
          <IonIcon size="large" icon={pinSharp}></IonIcon>
        </IonAvatar>
        <IonLabel>
          <h3>{label}</h3>
          <small> click to Add and / or remove tags </small>
        </IonLabel>
      </IonItem>
      <IonModal
        isOpen={openTagsSelectorOverlay}
        onDidDismiss={() => setOpenTagsSelectorOverlay(false)}
      >
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonItem>
                  {["save", "cancel"].map((item) => (
                    <span
                      key={item}
                      role="button"
                      slot="end"
                      aria-label={item}
                      onClick={() => {
                        if (item === "save") onCompletion(tagDtos);
                        setOpenTagsSelectorOverlay(false);
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" sizeSm="6">
                <MultiSelector
                  options={tagsRef.current?.map((tag) => ({
                    name: tag.name,
                    value: tag.name,
                  }))}
                  initValues={tagDtos.map((tag) => ({
                    name: tag.name,
                    value: tag.name,
                  }))}
                  label="Categorize your item by groupings ie tags"
                  onSelection={(values: ISelectOption[]) => {
                    const selectedTags: TagDTO[] = values.map((tag) => ({
                      name: tag.name,
                    }));
                    setTagDtos({ ...tagDtos, ...selectedTags });
                  }}
                />
              </IonCol>
              <IonCol size="12" sizeSm="6">
                <IonItem>
                  <IonInput
                    ref={tagsSearchInputRef as LegacyRef<HTMLIonInputElement>}
                    type="text"
                    label="tag name"
                    labelPlacement="floating"
                    onIonInput={(evt) => {
                      setTagsSearchList([
                        ...tagsRef.current.filter((item) =>
                          new RegExp(item.name, "i").test(`${evt.detail.value}`)
                        ),
                      ]);
                      setOpenTagsSearchList(true);
                    }}
                  />
                  {openTagsSearchList &&
                    tagsSearchList.map((tag, index) => (
                      <IonItem
                        key={index}
                        role="button"
                        aria-label="add tag"
                        onClick={() => {
                          setTagDtos([...tagDtos, tag]);
                          setOpenTagsSearchList(false);
                        }}
                      >
                        {tag.name}
                      </IonItem>
                    ))}
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      setTagDtos([
                        ...tagDtos,
                        { name: tagsSearchInputRef.current?.value as string },
                      ]);
                    }}
                  >
                    Add Tag
                  </IonButton>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </div>
  );
};
