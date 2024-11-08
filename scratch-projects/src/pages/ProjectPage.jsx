// src/pages/ProjectPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectInfo } from "../api/scratch";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  increment,
} from "firebase/firestore";

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const getUserId = () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = `anon_${Date.now()}_${Math.random()}`;
      localStorage.setItem("userId", userId);
    }
    return userId;
  };

  useEffect(() => {
    getProjectInfo(id).then(setProject);
    fetchComments();
  }, [id]);

  useEffect(() => {
    const fetchLikes = async () => {
      const projectDocRef = doc(db, "projects", id);
      const projectDoc = await getDoc(projectDocRef);

      if (projectDoc.exists()) {
        setLikesCount(projectDoc.data().likes || 0);
      }
    };

    fetchLikes();
  }, [id]);

  const fetchComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("projectId", "==", id),
      where("hidden", "!=", true)
    );
    const querySnapshot = await getDocs(q);
    const commentsData = querySnapshot.docs.map((doc) => doc.data());
    setComments(commentsData);
  };

  const handleAddComment = async () => {
    await addDoc(collection(db, "comments"), {
      projectId: id,
      text: newComment,
      timestamp: serverTimestamp(),
    });
    setNewComment("");
    fetchComments();
  };

  const handleLike = async () => {
    const likeDocRef = doc(db, "likes", `project_${id}_user_${getUserId()}`); // getUserId() puede ser una función que genere un ID único por usuario (por ejemplo, usando la IP o un identificador anónimo)
    const likeDoc = await getDoc(likeDocRef);

    const now = Date.now();

    if (likeDoc.exists()) {
      const lastLikeTime = likeDoc.data().timestamp.toMillis();
      if (now - lastLikeTime < 15 * 60 * 1000) {
        alert("Solo puedes dar like una vez cada 15 minutos.");
        return;
      }
    }

    await setDoc(likeDocRef, {
      timestamp: serverTimestamp(),
    });

    // Actualizar el conteo de likes en Firestore
    const projectDocRef = doc(db, "projects", id);
    await setDoc(projectDocRef, { likes: increment(1) }, { merge: true });
  };

  const handleReportComment = async (commentId) => {
    const commentDocRef = doc(db, "comments", commentId);
    await updateDoc(commentDocRef, {
      reports: increment(1),
    });

    const commentDoc = await getDoc(commentDocRef);
    if (commentDoc.data().reports >= 3) {
      // Ocultar o eliminar el comentario
      await updateDoc(commentDocRef, {
        hidden: true,
      });
    }

    fetchComments();
  };

  if (!project) return <div>Cargando...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl text-white font-bold">{project.title}</h1>
      <p>Autor: {project.author.username}</p>
      <p>Descripción: {project.description}</p>
      <iframe
        src={`https://scratch.mit.edu/projects/${id}/embed`}
        allowtransparency="true"
        width="485"
        height="402"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        className="my-4"
      ></iframe>

      {/* Sección de Likes */}
      <div>
        <button
          className="rgb-button text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
          onClick={handleLike}
        >
          {" "}
          Like
        </button>
        <span className="ml-2">
          {/* Mostrar número de likes desde Firebase */}
        </span>
      </div>

      {/* Sección de Comentarios */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Comentarios</h2>
        <div className="my-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border p-2 w-full"
            placeholder="Agregar un comentario..."
          />
          <button
            onClick={handleAddComment}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
          >
            Enviar
          </button>
        </div>
        <ul>
          {comments.map((comment, index) => (
            <li key={index} className="border-b py-2">
              {comment.text}
              <button
                onClick={() => handleReportComment(comment.id)}
                className="text-red-500 ml-2"
              >
                Reportar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectPage;
