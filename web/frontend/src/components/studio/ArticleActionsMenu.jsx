import { useState, useCallback } from "react";
import { Popover, ActionList, Button } from "@shopify/polaris";
import { MenuHorizontalIcon, EditIcon, ViewIcon, DuplicateIcon, DeleteIcon } from "@shopify/polaris-icons";

export function ArticleActionsMenu({
  post,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
}) {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    [],
  );

  const activator = (
    <Button
      icon={MenuHorizontalIcon}
      variant="tertiary"
      onClick={togglePopoverActive}
      accessibilityLabel="More actions"
    />
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      preferredAlignment="right"
    >
      <ActionList
        actionRole="menuitem"
        items={[
          {
            content: "Edit Outline & Content",
            icon: EditIcon,
            onAction: () => {
              togglePopoverActive();
              onEdit(post);
            },
          },
          {
            content: "View SEO/GEO Audit",
            icon: ViewIcon,
            onAction: () => {
              togglePopoverActive();
              onView(post);
            },
          },
          {
            content: "Duplicate",
            icon: DuplicateIcon,
            onAction: () => {
              togglePopoverActive();
              onDuplicate(post);
            },
          },
          {
            content: "Delete",
            icon: DeleteIcon,
            destructive: true,
            onAction: () => {
              togglePopoverActive();
              onDelete(post);
            },
          },
        ]}
      />
    </Popover>
  );
}

export default ArticleActionsMenu;
