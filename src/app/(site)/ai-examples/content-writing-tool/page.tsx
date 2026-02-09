export const dynamic = "force-dynamic";

const ContentGeneratorPage = () => {
  return null;
};

export default ContentGeneratorPage;

// Disabled content below
/*
"use client";
import Options from "@/components/AiTools/Options";
import PreviewGeneratedText from "@/components/AiTools/PreviewGeneratedText";
import Breadcrumb from "@/components/Breadcrumb";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import z from "zod";
import { integrations, messages } from "../../../../../integrations.config";

const ContentGeneratorSchema = z.object({
  contentTopic: z.string(),
  numberOfParagraphs: z.string(),
  contentType: z.string(),
});

const paragraphsCount = [1, 2, 3, 4, 5];
const contentTypes = ["Article", "Listicles", "How to guides", "Tweet"];

const _ContentGeneratorPage = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [data, setData] = useState({
    contentTopic: "",
    numberOfParagraphs: "",
    contentType: "",
  });

  const handleChange = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!integrations?.isOpenAIEnabled) {
      toast.error(messages.opanAi);
      return;
    }

    const validation = ContentGeneratorSchema.safeParse(data);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setGeneratedContent("Loading....");

    // the prompt
    const prompt = [
      {
        role: "system",
        content:
          "You will be provided with the content topic and the number of paragraphs and the content type. Your task is to generate the content with the exact paragraphs number \n",
      },
      {
        role: "user",
        content: `Content Topic: ${data.contentTopic} \nNumber of Paragraphs: ${data.numberOfParagraphs} \nContent-Type: ${data.contentType}`,
      },
      {
        role: "user",
        content:
          "Remove all the paragraph title and add line break after each paragraph",
      },
    ];

    //for the demo
    const apiKey = localStorage.getItem("apiKey");

    try {
      const response = await axios.post(
        "/api/generate-content",
        { apiKey, prompt },
        {
          headers: {
            "Content-Type": "application/json", // Adjust headers as needed
          },
        },
      );
      setGeneratedContent(response.data);
      console.log(response.data);
    } catch (error: any) {
      setGeneratedContent("Please Add the API Key!");
      console.error("Error:", error?.message);
    }

    setData({
      contentTopic: "",
      numberOfParagraphs: "",
      contentType: "",
    });
  };

  return null;
};

export default ContentGeneratorPage;

// Disabled - all content below commented out
*/
