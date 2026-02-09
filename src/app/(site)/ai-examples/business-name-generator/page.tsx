"use client";
import Options from "@/components/AiTools/Options";
import PreviewGeneratedText from "@/components/AiTools/PreviewGeneratedText";
import Breadcrumb from "@/components/Breadcrumb";
import axios from "axios";
import { useState } from "react";
import z from "zod";
import { integrations, messages } from "../../../../../integrations.config";
import toast from "react-hot-toast";

const BusinessNameGeneratorSchema = z.object({
  keyword: z.string(),
  industry: z.string(),
});

const optionData = [
  "Technology and Software",
  "Finance and Banking",
  "Healthcare and Pharmaceuticals",
  "Retail and Consumer Goods",
  "Entertainment and Media",
];

const BusinessNameGeneratorPage = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [data, setData] = useState({
    keyword: "",
    industry: "",
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

    const validation = BusinessNameGeneratorSchema.safeParse(data);
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
          "You will be provided with the business name and industry name, and your task is to generate product names \n",
      },
      {
        role: "user",
        content: `Business keyword: ${data.keyword} \n Business industry: ${data.industry}`,
      },
    ];

    //for the demo
    const apiKey = localStorage.getItem("apiKey");

    try {
      const response = await axios.post(
        "/api/generate-content",
        { prompt, apiKey },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setGeneratedContent(response.data);
    } catch (error: any) {
      setGeneratedContent("Please Add the API Key!");
      console.error("Error:", error?.message);
    }

    setData({
      keyword: "",
      industry: "",
    });
  };

  return (
    <>
      <title>
        Business Name Generator | AI Tool - Next.js Template for AI Tools
      </title>
      <meta name="description" content="This is AI Examples page for AI Tool" />
      <Breadcrumb pageTitle="Business Name Generator" />

      export const dynamic = "force-dynamic";

      const BusinessNameGeneratorPage = () => null;

      export default BusinessNameGeneratorPage;
            </h2>
