import { useState } from "react";
import { Modal, FormLayout, TextField, Select } from "@shopify/polaris";

export function CreateContentModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [intent, setIntent] = useState("Informational");
  const [keyword, setKeyword] = useState("");
  const [author, setAuthor] = useState("Thành Nguyễn");
  const [status, setStatus] = useState("Draft");
  const [error, setError] = useState("");

  const intentOptions = [
    { label: "Informational", value: "Informational" },
    { label: "Commercial", value: "Commercial" },
    { label: "Transactional", value: "Transactional" },
    { label: "Navigational", value: "Navigational" },
  ];

  const statusOptions = [
    { label: "Draft", value: "Draft" },
    { label: "Published", value: "Published" },
    { label: "Scheduled", value: "Scheduled" },
  ];

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Please enter a title for the blog post");
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      intent,
      author: author.trim() || "Thành Nguyễn",
      lastModified: formattedDate,
      seoScore: null,
      geoScore: 50,
      status,
      keyword: keyword.trim() || title.trim().toLowerCase(),
      hasAnswerBlock: false,
      hasFaqSchema: false,
      outline: [
        { id: "s1", level: "h1", title: title.trim(), description: "Intro & Direct Answer Block" },
        { id: "s2", level: "h2", title: "Key Concepts", description: "Core discussion" },
      ],
      bodyHtml: `<p>New blog content for "${title.trim()}".</p>`,
    };

    onSubmit(newPost);
    setTitle("");
    setKeyword("");
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create new blog post"
      primaryAction={{
        content: "Create blog post",
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Blog Title"
            value={title}
            onChange={(val) => {
              setTitle(val);
              if (error) setError("");
            }}
            placeholder="e.g. 10 Proven SEO & GEO Tips for Shopify Blogs"
            autoComplete="off"
            error={error}
            requiredIndicator
          />

          <Select
            label="Search Intent"
            options={intentOptions}
            value={intent}
            onChange={setIntent}
            helpText="Define search intent to align AI structure and schema generator."
          />

          <TextField
            label="Primary Keyword"
            value={keyword}
            onChange={setKeyword}
            placeholder="e.g. shopify blog seo geo"
            autoComplete="off"
          />

          <TextField
            label="Author"
            value={author}
            onChange={setAuthor}
            autoComplete="off"
          />

          <Select
            label="Publish Status"
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}

export default CreateContentModal;
